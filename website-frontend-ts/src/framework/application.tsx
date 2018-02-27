import React from "react";
import ReactDOM from "react-dom";
import {applyMiddleware, combineReducers, compose, createStore, Dispatch, ReducersMapObject} from "redux";
import {Provider} from "react-redux";
import {ConnectedRouter, routerMiddleware, routerReducer} from "react-router-redux";
import createSagaMiddleware from "redux-saga";
import {withRouter} from "react-router-dom";
import {LocationListener} from "history";
import createHistory from "history/createBrowserHistory";
import ErrorBoundary from "./component/ErrorBoundary";
import {reducer} from "./component/loading";
import {errorAction} from "./action";

import "babel-polyfill";

export type Effect = () => Iterator<any>;

export interface Module {
    reducers?: ReducersMapObject;
    effects?: Effect[];
    state?: any;
    initialize?: (dispatch: Dispatch<any>) => void;
    listener?: (dispatch: Dispatch<any>) => LocationListener;
}

export class Application {
    private modules: { [name: string]: Module } = {};

    public module(name: string, module: Module): void {
        this.modules[name] = module;
    }

    public start(Component: any, container: string): void {
        const initialState: any = {};
        const combinedReducers: ReducersMapObject = {
            routerReducer,
            loading: reducer
        };
        const sagas: Effect[] = [];
        for (const [name, module] of Object.entries(this.modules)) {
            const {reducers, effects, state} = module;
            combinedReducers[name] = this.createReducer(state, reducers);
            sagas.push(...effects);
            initialState[name] = state;
        }
        const rootReducer = combineReducers(combinedReducers);

        const history = createHistory();
        const sagaMiddleware = createSagaMiddleware();

        const store = createStore(rootReducer, initialState, this.devtools(applyMiddleware(routerMiddleware(history), sagaMiddleware)));
        sagas.forEach(sagaMiddleware.run);

        Object.values(this.modules).forEach(({initialize, listener}) => {
            if (listener) {
                const listenerInstance = listener(store.dispatch);
                history.listen(listenerInstance);
                listenerInstance(history.location, "PUSH");         // trigger history with current location on first load
            }
            if (initialize) {
                initialize(store.dispatch);
            }
        });

        window.onerror = (message, source, line, column, error) => {
            store.dispatch(errorAction(error));     // TODO: error can be null, think about how to handle all cases
        };

        const WithRouterComponent = withRouter(Component);
        ReactDOM.render(
            <Provider store={store}>
                <ErrorBoundary>
                    <ConnectedRouter history={history}>
                        <WithRouterComponent/>
                    </ConnectedRouter>
                </ErrorBoundary>
            </Provider>,
            document.getElementById(container)
        );
    }

    private createReducer(initialState: any, reducers: ReducersMapObject) {
        return function reducer(state = initialState, action) {
            if (reducers.hasOwnProperty(action.type)) {
                return reducers[action.type](state, action);
            }
            return state;
        };
    }

    private devtools(enhancer) {
        const production = process.env.NODE_ENV === "production";
        if (!production) {
            // tslint:disable-next-line:no-string-literal
            const reduxExtension = window["__REDUX_DEVTOOLS_EXTENSION__"];
            if (reduxExtension) {
                return compose(enhancer, reduxExtension({}));
            }
        }
        return enhancer;
    }
}

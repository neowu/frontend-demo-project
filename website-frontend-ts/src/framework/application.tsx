import React from "react";
import ReactDOM from "react-dom";
import {applyMiddleware, combineReducers, compose, createStore, Dispatch} from "redux";
import {Provider} from "react-redux";
import {ConnectedRouter, routerMiddleware, routerReducer} from "react-router-redux";
import createSagaMiddleware from "redux-saga";
import {withRouter} from "react-router-dom";
import {LocationListener} from "history";
import createHistory from "history/createBrowserHistory";

import ErrorBoundary from "./component/ErrorBoundary";
import {reducer} from "./component/loading";
import {errorAction} from "./action";

export interface Module {
    reducers?: any;
    effects?: any[];
    state?: any;
    initialize?: (dispatch: Dispatch<any>) => void;
    listener?: (dispatch: Dispatch<any>) => LocationListener;
}

interface App {
    modules: { [name: string]: Module };
    module: (name: string, module: Module) => void;
    start: (Component: any, container: any) => void;
}

export function createApp(): App {
    const app: App = {
        modules: {},
        module,
        start
    };
    return app;

    function module(name: string, module: Module): void {
        app.modules[name] = module;
    }

    function createReducer(initialState, reducers) {
        return function reducer(state = initialState, action) {
            if (reducers.hasOwnProperty(action.type)) {
                return reducers[action.type](state, action);
            }
            return state;
        };
    }

    function devtools(enhancer) {
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

    function start(Component: any, container: any): void {
        const initialState: any = {};
        const combinedReducers: any = {
            routerReducer,
            loading: reducer
        };
        const sagas = [];
        for (const [name, module] of Object.entries(app.modules)) {
            const {reducers, effects, state} = module;
            combinedReducers[name] = createReducer(state, reducers);
            sagas.push(...effects);
            initialState[name] = state;
        }
        const rootReducer = combineReducers(combinedReducers);

        const history = createHistory();
        const sagaMiddleware = createSagaMiddleware();

        const store = createStore(rootReducer, initialState, devtools(applyMiddleware(routerMiddleware(history), sagaMiddleware)));
        sagas.forEach(sagaMiddleware.run);

        Object.values(app.modules).forEach(({initialize, listener}) => {
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
}

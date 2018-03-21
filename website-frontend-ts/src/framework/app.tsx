import React, {ComponentType} from "react";
import ReactDOM from "react-dom";
import {applyMiddleware, combineReducers, compose, createStore, Store} from "redux";
import {Provider} from "react-redux";
import createSagaMiddleware, {SagaMiddleware} from "redux-saga";
import {takeLatest} from "redux-saga/effects";
import {withRouter} from "react-router-dom";
import {History} from "history";
import {ConnectedRouter, connectRouter, routerMiddleware} from "connected-react-router";
import createHistory from "history/createBrowserHistory";
import ErrorBoundary from "./component/ErrorBoundary";
import {Action, errorAction, ErrorActionType, InitializeStateActionType, LocationChangedActionType} from "./action";
import {loadingReducer} from "./loading";
import {HandlerMap, run} from "./handler";
import "@babel/polyfill";

interface App {
    store: Store<any>;
    history: History;
    sagaMiddleware: SagaMiddleware<any>;
    namespaces: Set<string>;
    reducerHandlers: HandlerMap;
    sagaActionTypes: string[];
    effectHandlers: HandlerMap;
}

export const app = createApp();

export function render(component: ComponentType<any>, container: string) {
    if (!component) {
        throw new Error("component must not be null");
    }
    const WithRouterComponent = withRouter(component);
    ReactDOM.render(
        <Provider store={app.store}>
            <ErrorBoundary>
                <ConnectedRouter history={app.history}>
                    <WithRouterComponent/>
                </ConnectedRouter>
            </ErrorBoundary>
        </Provider>,
        document.getElementById(container)
    );
}

function devtools(enhancer) {
    const production = process.env.NODE_ENV === "production";
    if (!production) {
        const reduxExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
        if (reduxExtension) {
            return compose(enhancer, reduxExtension({}));
        }
    }
    return enhancer;
}

function createApp(): App {
    const namespaces = new Set<string>();
    const reducerHandlers: HandlerMap = {};
    const effectHandlers: HandlerMap = {};
    const sagaActionTypes = [LocationChangedActionType, ErrorActionType];    // actionTypes are shared by multiple modules

    function reducer(state: any = {}, action: Action): any {
        if (action.type === InitializeStateActionType) {
            const namespace = action.payload.namespace;
            const initialState = action.payload.state;
            return {...state, [namespace]: initialState};
        }

        const handlers = reducerHandlers[action.type];
        if (handlers) {
            const rootState = app.store.getState();
            const newState = {...state};
            Object.keys(handlers).forEach(namespace => {
                const handler = handlers[namespace];
                newState[namespace] = handler(action.payload, state[namespace], rootState);
            });
            return newState;
        }

        return state;
    }

    function* saga() {
        yield takeLatest(sagaActionTypes, function* (action: Action) {
            const handlers = effectHandlers[action.type];
            if (handlers) {
                const rootState = app.store.getState();
                for (const namespace of Object.keys(handlers)) {
                    const handler = handlers[namespace];
                    yield* run(handler, action.payload, rootState.app[namespace], rootState);
                }
            }
        });
    }

    const history = createHistory();
    const reducers = {
        loading: loadingReducer,
        app: reducer
    };
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(connectRouter(history)(combineReducers(reducers)), {}, devtools(applyMiddleware(routerMiddleware(history), sagaMiddleware)));
    sagaMiddleware.run(saga);

    window.onerror = (message: string, source?: string, line?: number, column?: number, error?: Error) => {
        store.dispatch(errorAction(error));     // TODO: error can be null, think about how to handle all cases
    };

    return {history, store, namespaces, reducerHandlers, sagaActionTypes, effectHandlers, sagaMiddleware};
}

import "@babel/polyfill";
import {ConnectedRouter, connectRouter, routerMiddleware} from "connected-react-router";
import {History} from "history";
import createHistory from "history/createBrowserHistory";
import React, {ComponentType} from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {withRouter} from "react-router-dom";
import {applyMiddleware, combineReducers, compose, createStore, Dispatch, Middleware, Reducer, Store, StoreEnhancer} from "redux";
import createSagaMiddleware, {SagaMiddleware} from "redux-saga";
import {takeLatest} from "redux-saga/effects";
import {Action, initializeStateReducer} from "./action";
import ErrorBoundary from "./component/ErrorBoundary";
import {errorAction, ErrorActionType} from "./exception";
import {HandlerMap, run} from "./handler";
import {LocationChangedActionType} from "./listener";
import {loadingReducer} from "./loading";

interface App {
    store: Store<any>;
    history: History;
    sagaMiddleware: SagaMiddleware<any>;
    namespaces: Set<string>;
    reducerHandlers: HandlerMap;
    sagaActionTypes: string[];
    effectHandlers: HandlerMap;
}

console.time("[framework] initialized");
export const app = createApp();

export function render(component: ComponentType<any>, container: string): void {
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
    console.timeEnd("[framework] initialized");
}

function devtools(enhancer: StoreEnhancer<{}>): StoreEnhancer<{}> {
    const production = process.env.NODE_ENV === "production";
    if (!production) {
        const reduxExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
        if (reduxExtension) {
            return compose(enhancer, reduxExtension({}));
        }
    }
    return enhancer;
}

function errorMiddleware(): Middleware {
    return () => (next: Dispatch<any>) => (action: any) => {
        try {
            return next(action);
        } catch (error) {
            console.error(error);
            return next(errorAction(error));
        }
    };
}

function reducer(reducerHandlers: HandlerMap): Reducer<any> {
    return (state: any = {}, action: Action<any>): any => {
        const handlers = reducerHandlers.get(action.type);
        if (handlers) {
            const rootState = app.store.getState();
            const newState = {...state};
            for (const namespace of Object.keys(handlers)) {
                const handler = handlers[namespace];
                newState[namespace] = handler(action.payload, state[namespace], rootState);
            }
            return newState;
        }
        return state;
    };
}

function saga(sagaActionTypes: string[], effectHandlers: HandlerMap): () => Iterator<any> {
    return function* saga() {
        yield takeLatest(sagaActionTypes, function* (action: Action<any>) {
            const handlers = effectHandlers.get(action.type);
            if (handlers) {
                const rootState = app.store.getState();
                for (const namespace of Object.keys(handlers)) {
                    const handler = handlers[namespace];
                    yield* run(handler, action.payload, rootState.app[namespace], rootState);
                }
            }
        });
    };
}

function createApp(): App {
    console.info("[framework] initialize");

    const namespaces = new Set<string>();
    const reducerHandlers = new HandlerMap();
    const sagaActionTypes = [LocationChangedActionType, ErrorActionType];    // actionTypes are shared by multiple modules
    const effectHandlers = new HandlerMap();

    const history = createHistory();
    const reducers = {
        loadings: loadingReducer,
        app: initializeStateReducer(reducer(reducerHandlers))
    };
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(connectRouter(history)(combineReducers(reducers)), {}, devtools(applyMiddleware(errorMiddleware(), routerMiddleware(history), sagaMiddleware)));
    sagaMiddleware.run(saga(sagaActionTypes, effectHandlers));

    window.onerror = (message: string, source?: string, line?: number, column?: number, error?: Error) => {
        store.dispatch(errorAction(error));     // TODO: error can be null, think about how to handle all cases
    };

    return {history, store, namespaces, reducerHandlers, sagaActionTypes, effectHandlers, sagaMiddleware};
}

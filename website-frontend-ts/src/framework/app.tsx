import {ConnectedRouter, connectRouter, LOCATION_CHANGE, routerMiddleware} from "connected-react-router";
import {History} from "history";
import createHistory from "history/createBrowserHistory";
import React, {ComponentType} from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {withRouter} from "react-router-dom";
import {applyMiddleware, combineReducers, compose, createStore, Dispatch, Middleware, MiddlewareAPI, Reducer, Store, StoreEnhancer} from "redux";
import createSagaMiddleware, {SagaIterator, SagaMiddleware} from "redux-saga";
import {takeLatest} from "redux-saga/effects";
import {Action, initializeStateReducer} from "./action";
import ErrorBoundary from "./component/ErrorBoundary";
import {errorAction, ErrorActionType} from "./exception";
import {HandlerMap, run} from "./handler";
import {State} from "./index";
import {loadingReducer} from "./loading";

interface App {
    store: Store<State>;
    history: History;
    sagaMiddleware: SagaMiddleware<any>;
    namespaces: Set<string>;
    reducers: HandlerMap;
    sagaActionTypes: string[];
    effects: HandlerMap;
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

function devtools(enhancer: StoreEnhancer<State>): StoreEnhancer<State> {
    const production = process.env.NODE_ENV === "production";
    if (!production) {
        const extension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
        if (extension) {
            return compose(enhancer, extension({}));
        }
    }
    return enhancer;
}

function errorMiddleware(): Middleware {
    return ((store: MiddlewareAPI<State>) => (next: Dispatch<State>) => (action: Action<any>): Action<any> => {
        try {
            return next(action);
        } catch (error) {
            console.error(error);
            return next(errorAction(error));
        }
    }) as Middleware;   // due to typescript limitation, Action<any> is not recognized as <A extend Action> (which should be), so here it has to cast to Middleware
}

function appReducer(reducers: HandlerMap): Reducer<any> {
    const appReducer = (state: any = {}, action: Action<any>): any => {
        const handlers = reducers.get(action.type);
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
    return initializeStateReducer(appReducer);
}

function saga(sagaActionTypes: string[], effects: HandlerMap, store: Store<State>): () => SagaIterator {
    return function* saga() {
        yield takeLatest(sagaActionTypes, function* (action: Action<any>) {
            const handlers = effects.get(action.type);
            if (handlers) {
                const rootState = store.getState();
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
    const reducers = new HandlerMap();
    const sagaActionTypes = [LOCATION_CHANGE, ErrorActionType];    // actionTypes are shared by multiple modules
    const effects = new HandlerMap();

    const history = createHistory();
    const sagaMiddleware = createSagaMiddleware();
    const reducerMap: {[P in keyof State]?: Reducer<State[P]>} = {
        loading: loadingReducer,
        app: appReducer(reducers)
    };
    const rootReducer = combineReducers<State>(reducerMap);
    const store = createStore(connectRouter(history)(rootReducer), devtools(applyMiddleware(errorMiddleware(), routerMiddleware(history), sagaMiddleware)));
    sagaMiddleware.run(saga(sagaActionTypes, effects, store));

    window.onerror = (message: string, source?: string, line?: number, column?: number, error?: Error): void => {
        store.dispatch(errorAction(error));     // TODO: error can be null, think about how to handle all cases
    };

    return {history, store, namespaces, reducers, sagaActionTypes, effects, sagaMiddleware};
}

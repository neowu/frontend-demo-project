import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import {ConnectedRouter, routerMiddleware, routerReducer} from "react-router-redux";
import createSagaMiddleware from "redux-saga";
import {withRouter} from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import ErrorBoundary from "./components/ErrorBoundary";
import errorModule from "./modules/error";
import loadingModule from "./modules/loading";

export function createApp() {
    const app = {
        modules: {},
        module,
        start
    };
    return app;

    function module(name, module) {
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

    function start(Component, container) {
        module("error", errorModule);
        module("loading", loadingModule);

        const initialState = {};
        const combinedReducers = {routerReducer};
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
        const store = createStore(rootReducer, initialState, applyMiddleware(routerMiddleware(history), sagaMiddleware));
        sagas.forEach(sagaMiddleware.run);

        Object.values(app.modules).forEach(({initialize, listener}) => {
            if (listener) {
                const listenerInstance = listener(store.dispatch);
                history.listen(listenerInstance);
                listenerInstance(history.location);         // trigger history with current location on first load
            }
            if (initialize) initialize(store.dispatch);
        });

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

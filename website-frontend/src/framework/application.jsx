import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import createSagaMiddleware from "redux-saga";

import ErrorBoundary from "./components/ErrorBoundary";
import errorModule from "./modules/error";
import loadingModule from "./modules/loading";

export function create() {
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
        const combinedReducers = {};
        const sagas = [];
        for (const [name, module] of Object.entries(app.modules)) {
            const {reducers, effects, state} = module;
            combinedReducers[name] = createReducer(state, reducers);
            sagas.push(...effects);
            initialState[name] = state;
        }
        const rootReducer = combineReducers(combinedReducers);

        const sagaMiddleware = createSagaMiddleware();
        const store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware));
        sagas.forEach(sagaMiddleware.run);
        ReactDOM.render(
            <Provider store={store}>
                <ErrorBoundary>
                    <Component/>
                </ErrorBoundary>
            </Provider>,
            document.getElementById(container)
        );
    }
}

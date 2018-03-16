import {ComponentType} from "react";
import {History, Location} from "history";
import {Action as ReduxAction, Store} from "redux";
import {SagaMiddleware} from "redux-saga";

export type Handler<T> = (data: any, state: T, rootState?: any) => T;

export interface HandlerMap {
    [actionType: string]: {[namespace: string]: Handler<any>};
}

export interface App {
    store: Store<any>;
    history: History;
    sagaMiddleware: SagaMiddleware<any>;
    namespaces: Set<string>;
    reducerHandlers: HandlerMap;
    sagaActionTypes: string[];
    effectHandlers: HandlerMap;
}

export interface Action extends ReduxAction {
    type: string;
    data: any;
}

export interface Components {
    [componentName: string]: ComponentType<any>;
}

export interface Listener {
    _onInitialized?();

    _onLocationChanged?(location: Location);

    _onError?(error: any);        // TODO: formalize error type
}

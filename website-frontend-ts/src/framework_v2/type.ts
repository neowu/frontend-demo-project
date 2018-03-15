import {ComponentType} from "react";
import {History} from "history";
import {Action as ReduxAction, Store} from "redux";

export type Handler<T> = (data: any, state: T, rootState?: any) => T;

export interface HandlerMap {
    [actionType: string]: {[namespace: string]: Handler<any>};
}

export interface App {
    history: History;
    store: Store<any>;
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

export interface Module {
    actionHandler: {[actionType: string]: Handler<any>};
    components: Components;
}

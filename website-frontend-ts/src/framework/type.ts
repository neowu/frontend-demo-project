import {ComponentType} from "react";
import {Action as HistoryAction, History, Location} from "history";
import {Action as ReduxAction, Store} from "redux";
import {SagaMiddleware} from "redux-saga";
import {RouterState} from "connected-react-router";
import {LoadingState} from "./loading";
import {HandlerMap} from "./handler";

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
    payload: any;
}

export interface Components {
    [componentName: string]: ComponentType<any>;
}

export interface Listener {
    onInitialized?();

    onLocationChanged?(event: LocationChangedEvent);

    onError?(error: any);        // TODO: formalize error type
}

export interface LocationChangedEvent {
    location: Location;
    action: HistoryAction;
}

export interface FrameworkState extends RouterState, LoadingState {
}

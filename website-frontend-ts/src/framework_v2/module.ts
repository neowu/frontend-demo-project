import {Components, Handler, HandlerMap, HandlerMetadata, HandlerType} from "./type";
import {app} from "./app";
import {errorAction, ErrorActionType, initializeStateAction, LocationChangedActionType} from "./action";
import {put} from "redux-saga/effects";

export function handler(type: HandlerType = HandlerType.REDUCER, global: boolean = false) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        descriptor.value.meta = {type, global};
    };
}

export function module(namespace: string, components: Components, actionHandler: any, initialState: any): Components {
    if (!app.namespaces.has(namespace)) {
        app.namespaces.add(namespace);

        Object.keys(actionHandler.__proto__).forEach(actionType => {
            const handler: Handler<any> = actionHandler[actionType];

            const isListenerHandler = registerListenerHandler(namespace, actionType, handler);
            if (isListenerHandler) {
                return;
            }

            const meta: HandlerMetadata = metadata(handler);
            const qualifiedActionType = meta.global === true ? actionType : `${namespace}/${actionType}`;
            if (meta.type === HandlerType.EFFECT) {
                if (!app.sagaActionTypes.includes(qualifiedActionType)) {
                    app.sagaActionTypes.push(qualifiedActionType);          // saga takeLatest() requires string[], global action type could exists in multiple modules
                }
                putHandler(app.effectHandlers, namespace, qualifiedActionType, handler);
            } else {
                putHandler(app.reducerHandlers, namespace, qualifiedActionType, handler);
            }
        });

        initializeState(namespace, initialState);
        onInitialized(actionHandler);
        onLocationChanged(actionHandler);
    }
    return components;
}

function registerListenerHandler(namespace: string, actionType: string, handler: any): boolean {
    switch (actionType) {
        case "onInitialized":
            return true;
        case "onLocationChanged":
            putHandler(app.effectHandlers, namespace, LocationChangedActionType, handler);     // LocationChangedActionType is already in app.sagaActionTypes
            return true;
        case "onError":
            putHandler(app.effectHandlers, namespace, ErrorActionType, handler);   // ErrorActionType is already in app.sagaActionTypes
            return true;
    }
    return false;
}

function metadata(handler: Handler<any>): HandlerMetadata {
    if (handler.meta) {
        return handler.meta;
    }
    return {type: HandlerType.REDUCER, global: false};
}

function putHandler(handlers: HandlerMap, namesapce: string, actionType: string, handler: Handler<any>): void {
    if (!handlers[actionType]) {
        handlers[actionType] = {};
    }
    handlers[actionType][namesapce] = handler;
}

function initializeState(namespace: string, initialState: any) {
    app.store.dispatch(initializeStateAction(namespace, initialState));
}

function onInitialized(actionHandler: any) {
    if (actionHandler.onInitialized) {
        app.sagaMiddleware.run(initialize(actionHandler.onInitialized));
    }
}

function initialize(initializer: any) {
    return function* () {
        try {
            yield initializer();
        } catch (error) {
            yield put(errorAction(error));
        }
    };
}

function onLocationChanged(actionHandler: any) {
    if (actionHandler.onLocationChanged) {
        app.sagaMiddleware.run(actionHandler.onLocationChanged, app.history.location);  // history listener won't trigger on first refresh or on module loading, manual trigger once
    }
}

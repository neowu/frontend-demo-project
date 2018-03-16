import {Components, Handler, HandlerMap} from "./type";
import {app} from "./app";
import {LocationChangedActionType} from "./action";

export function module(namespace: string, components: Components, actionHandler: any, initialState: any): Components {
    if (!app.namespaces.has(namespace)) {
        app.namespaces.add(namespace);

        Object.keys(actionHandler.__proto__).forEach(actionType => {
            const handler = actionHandler[actionType];

            const isListenerHandler = registerListenerHandler(namespace, actionType, handler);
            if (isListenerHandler) {
                return;
            }

            const qualifiedActionName = qualifiedActionType(namespace, actionType);
            if (actionType.charAt(0) === "_") {
                app.sagaActionTypes.push(qualifiedActionName);
                put(app.effectHandlers, qualifiedActionName, namespace, handler);
            } else {
                put(app.reducerHandlers, qualifiedActionName, namespace, handler);
            }
        });

        initializeState(namespace, initialState);
        onInitialized(actionHandler);
        onLocationChanged(actionHandler);
    }
    return components;
}

function registerListenerHandler(namespace: string, actionType: string, handler: any): boolean {
    if (actionType === "_onInitialized") {
        return true;
    } else if (actionType === "_onLocationChanged") {
        put(app.effectHandlers, LocationChangedActionType, namespace, handler); // LocationChangedActionType is already in app.sagaActionTypes
        return true;
    }
    return false;
}

function qualifiedActionType(namespace: string, actionType: string): string {   // TODO: is all framework events saga effect, if so just defined in listener?
    if (actionType.startsWith("@@")) {
        return actionType;
    }
    return `${namespace}/${actionType}`;
}

function put(handlers: HandlerMap, actionName: string, namespace: string, handler: Handler<any>): void {
    if (!handlers[actionName]) {
        handlers[actionName] = {};
    }
    handlers[actionName][namespace] = handler;
}

function initializeState(namespace: string, initialState: any) {
    const initActionType = `@@framework/init/${namespace}`;             // TODO: more elegant way to init state?
    put(app.reducerHandlers, initActionType, namespace, () => initialState);
    app.store.dispatch({type: initActionType});
}

function onInitialized(actionHandler: any) {
    if (actionHandler._onInitialized) {
        app.sagaMiddleware.run(actionHandler._onInitialized);
    }
}

function onLocationChanged(actionHandler: any) {
    if (actionHandler._onLocationChanged) {
        app.sagaMiddleware.run(actionHandler._onLocationChanged, app.history.location);  // history listener won't trigger on first refresh or on module loading, manual trigger once
    }
}

import {Components, Handler, HandlerMap, Listener, Module} from "./type";
import {app} from "./app";

export function module(namespace: string, components: Components, actionHandler: any, initialState: any, listener?: Listener): Module {
    if (!app.namespaces.has(namespace)) {
        app.namespaces.add(namespace);

        Object.keys(actionHandler.__proto__).forEach(actionType => {
            const qualifiedActionName = qualifiedActionType(namespace, actionType);
            if (actionType.charAt(0) === "_") {
                app.sagaActionTypes.push(qualifiedActionName);
                put(app.effectHandlers, qualifiedActionName, namespace, actionHandler[actionType]);
            } else {
                put(app.reducerHandlers, qualifiedActionName, namespace, actionHandler[actionType]);
            }
        });
        const initActionType = `@@framework/INIT/${namespace}`;
        put(app.reducerHandlers, initActionType, namespace, () => initialState);
        app.store.dispatch({type: initActionType});

        if (listener && listener.initialized) {
            listener.initialized(app.store.dispatch);
        }
    }
    return {actionHandler, components, listener};
}

function qualifiedActionType(namespace: string, actionType: string): string {
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

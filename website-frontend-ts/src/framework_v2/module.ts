import {Components, Handler, HandlerMap, Module} from "./type";
import {app} from "./app";

export function module(namespace: string, initialState: any, actionHandler: any, components: Components): Module {
    if (!app.namespaces.has(namespace)) {
        Object.keys(actionHandler).forEach(actionType => {
            const qualifiedActionName = qualifiedActionType(namespace, actionType);
            if (actionType.charAt(0) === "_") {
                app.sagaActionTypes.push(actionType);
                put(app.effectHandlers, qualifiedActionName, namespace, actionHandler[actionType]);
            } else {
                put(app.reducerHandlers, qualifiedActionName, namespace, actionHandler[actionType]);
            }
        });
        const initActionType = `@@framework/INIT/${namespace}`;
        put(app.reducerHandlers, initActionType, namespace, (data, state) => initialState);
        app.namespaces.add(namespace);
        app.store.dispatch({type: initActionType});
    }
    return {actionHandler, components};
}

function qualifiedActionType(namespace: string, actionType: string) {
    if (actionType.startsWith("@@")) {
        return actionType;
    }
    return `${namespace}/${actionType}`;
}

function put(handlers: HandlerMap, actionName: string, namespace: string, handler: Handler<any>) {
    if (!handlers[actionName]) {
        handlers[actionName] = {};
    }
    handlers[actionName][namespace] = handler;
}

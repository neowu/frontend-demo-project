import {Components, Handler, HandlerMap, Module} from "./type";
import {app} from "./app";

export function module(namespace: string, initialState: any, actionHandler: any, components: Components): Module {
    if (!app.namespaces.has(namespace)) {
        Object.keys(actionHandler).forEach(actionName => {
            const qualifiedActionName = `${namespace}/${actionName}`;
            if (actionName.charAt(0) === "_") {
                app.sagaActionTypes.push(actionName);
                put(app.effectHandlers, qualifiedActionName, namespace, actionHandler[actionName]);
            } else {
                put(app.reducerHandlers, qualifiedActionName, namespace, actionHandler[actionName]);
            }
        });
        const initActionType = `@@framework/INIT/${namespace}`;
        put(app.reducerHandlers, initActionType, namespace, initHandler(initialState));
        app.namespaces.add(namespace);
        app.store.dispatch({type: initActionType});
    }
    return {actionHandler, components};
}

function initHandler(initialState) {
    return (data, state = initialState) => initialState;
}

function put(handlers: HandlerMap, actionName: string, namespace: string, handler: Handler<any>) {
    if (!handlers[actionName]) {
        handlers[actionName] = {};
    }
    handlers[actionName][namespace] = handler;
}

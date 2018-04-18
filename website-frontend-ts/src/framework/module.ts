import {LOCATION_CHANGE} from "connected-react-router";
import {initStateAction} from "./action";
import {app} from "./app";
import {ERROR_ACTION_TYPE} from "./exception";
import {Handler, qualifiedActionType, run} from "./handler";
import {Listener, LocationChangedEvent} from "./listener";

export function register(module: {namespace: string, handler?: any, initialState?: any, listener?: Listener}): void {
    const {namespace, handler, initialState, listener} = module;
    if (!app.namespaces.has(namespace)) {
        app.namespaces.add(namespace);
        console.info(`[framework] register module, namespace=${namespace}`);

        if (handler) {
            registerHandler(namespace, handler, initialState);
        }
        if (listener) {
            registerListener(namespace, listener);
        }
    }
}

function registerHandler(namespace: string, handlers: any, initialState: any): void {
    for (const actionType of Object.keys(Object.getPrototypeOf(handlers))) {
        const handler: Handler = handlers[actionType];

        const type = qualifiedActionType(handler, namespace, actionType);
        if (handler.effect === true) {
            console.info(`[framework] add effect, namespace=${namespace}, actionType=${type}, loading=${handler.loading}`);
            if (!handler.global || !app.sagaActionTypes.includes(type)) {
                app.sagaActionTypes.push(type);          // saga takeLatest() requires string[], global action type could exists in multiple modules
            }
            app.effects.put(type, namespace, handler);
        } else {
            console.info(`[framework] add reducer, namespace=${namespace}, actionType=${type}`);
            app.reducers.put(type, namespace, handler);
        }
    }

    initializeState(namespace, initialState);
}

function registerListener(namespace: string, listener: Listener): void {
    if (listener.onLocationChanged) {
        app.effects.put(LOCATION_CHANGE, namespace, listener.onLocationChanged);     // LocationChangedActionType is already in app.sagaActionTypes
    }
    if (listener.onError) {
        app.effects.put(ERROR_ACTION_TYPE, namespace, listener.onError);   // ERROR_ACTION_TYPE is already in app.sagaActionTypes
    }

    // initialize after register handlers
    if (listener.onInitialized) {
        app.sagaMiddleware.run(function* () {
            yield* run(listener.onInitialized);
        });
    }
    if (listener.onLocationChanged) {
        const event: LocationChangedEvent = {location: app.history.location, action: "PUSH"};
        app.sagaMiddleware.run(function* () {
            yield* run(listener.onLocationChanged, event);
        });    // history listener won't trigger on first refresh or on module loading, manual trigger once
    }
}

function initializeState(namespace: string, initialState: any): void {
    app.store.dispatch(initStateAction(namespace, initialState));
}

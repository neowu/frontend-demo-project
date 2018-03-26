import {Listener, LocationChangedEvent} from "./listener";
import {app} from "./app";
import {ErrorActionType, initializeStateAction, LocationChangedActionType} from "./action";
import {Handler, putHandler, qualifiedActionType, run} from "./handler";

export function register(namespace: string, actionHandler?: any, initialState?: any, lisener?: Listener): void {
    if (!app.namespaces.has(namespace)) {
        app.namespaces.add(namespace);
        console.info("[framework] register module, namespace=%s", namespace);

        if (actionHandler) {
            registerHandler(namespace, actionHandler, initialState);
        }
        if (lisener) {
            registerListener(namespace, lisener);
        }
    }
}

function registerHandler(namespace: string, actionHandler: any, initialState: any): void {
    Object.keys(Object.getPrototypeOf(actionHandler)).forEach(actionType => {
        const handler: Handler = actionHandler[actionType];

        const type = qualifiedActionType(handler, namespace, actionType);
        if (handler.effect === true) {
            console.info("[framework] add effect, namespace=%s, actionType=%s, loading=%s", namespace, type, handler.loading);
            if (!handler.global || !app.sagaActionTypes.includes(type)) {
                app.sagaActionTypes.push(type);          // saga takeLatest() requires string[], global action type could exists in multiple modules
            }
            putHandler(app.effectHandlers, namespace, type, handler);
        } else {
            console.info("[framework] add reducer, namespace=%s, actionType=%s", namespace, type);
            putHandler(app.reducerHandlers, namespace, type, handler);
        }
    });

    initializeState(namespace, initialState);
}

function registerListener(namespace: string, listener: Listener): void {
    if (listener.onLocationChanged) {
        putHandler(app.effectHandlers, namespace, LocationChangedActionType, listener.onLocationChanged);     // LocationChangedActionType is already in app.sagaActionTypes
    }
    if (listener.onError) {
        putHandler(app.effectHandlers, namespace, ErrorActionType, listener.onError);   // ErrorActionType is already in app.sagaActionTypes
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
    app.store.dispatch(initializeStateAction(namespace, initialState));
}

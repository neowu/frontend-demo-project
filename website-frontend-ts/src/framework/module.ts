import {ErrorActionType, initializeStateAction, LocationChangedActionType} from "./action";
import {app} from "./app";
import {Handler, qualifiedActionType, run} from "./handler";
import {Listener, LocationChangedEvent} from "./listener";

export function register(namespace: string, actionHandler?: any, initialState?: any, lisener?: Listener): void {
    if (!app.namespaces.has(namespace)) {
        app.namespaces.add(namespace);
        console.info(`[framework] register module, namespace=${namespace}`);

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
            console.info(`[framework] add effect, namespace=${namespace}, actionType=${type}, loading=${handler.loading}`);
            if (!handler.global || !app.sagaActionTypes.includes(type)) {
                app.sagaActionTypes.push(type);          // saga takeLatest() requires string[], global action type could exists in multiple modules
            }
            app.effectHandlers.put(type, namespace, handler);
        } else {
            console.info(`[framework] add reducer, namespace=${namespace}, actionType=${type}`);
            app.reducerHandlers.put(type, namespace, handler);
        }
    });

    initializeState(namespace, initialState);
}

function registerListener(namespace: string, listener: Listener): void {
    if (listener.onLocationChanged) {
        app.effectHandlers.put(LocationChangedActionType, namespace, listener.onLocationChanged);     // LocationChangedActionType is already in app.sagaActionTypes
    }
    if (listener.onError) {
        app.effectHandlers.put(ErrorActionType, namespace, listener.onError);   // ErrorActionType is already in app.sagaActionTypes
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

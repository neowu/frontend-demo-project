import {put} from "redux-saga/effects";
import {loadingAction} from "./loading";
import {errorAction} from "./action";

interface HandlerMetadata {
    effect?: boolean;
    loading?: string;
    global?: boolean;
}

export type Handler<T> = ((payload?: any, state?: T, rootState?: any) => T) & HandlerMetadata;

export interface HandlerMap {
    [actionType: string]: {[namespace: string]: Handler<any>};
}

export function effect(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler: Handler<any> = descriptor.value;
    handler.effect = true;
}

export function loading(loading: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const handler: Handler<any> = descriptor.value;
        handler.loading = loading;
    };
}

export function global(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler: Handler<any> = descriptor.value;
    handler.global = true;
}

export function putHandler(handlers: HandlerMap, namesapce: string, actionType: string, handler: Handler<any>): void {
    if (!handlers[actionType]) {
        handlers[actionType] = {};
    }
    handlers[actionType][namesapce] = handler;
}

export function* run(handler: Handler<any>, payload?: any, state?: any, rootState?: any) {
    try {
        if (handler.loading) {
            yield put(loadingAction(handler.loading, true));
        }
        yield* handler(payload, state, rootState);
    } catch (error) {
        yield put(errorAction(error));
    } finally {
        if (handler.loading) {
            yield put(loadingAction(handler.loading, false));
        }
    }
}

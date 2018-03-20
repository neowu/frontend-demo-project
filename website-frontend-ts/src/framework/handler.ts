import {put} from "redux-saga/effects";
import {updateLoadingAction} from "./loading";
import {errorAction} from "./action";

export interface HandlerMetadata {
    effect: boolean;
    loading?: boolean;
    qualifiedActionType?: string;
}

type HandlerFunction<T> = (payload?: any, state?: T, rootState?: any) => T;
export type Handler<T> = HandlerFunction<T> & {meta?: HandlerMetadata};

export interface HandlerMap {
    [actionType: string]: {[namespace: string]: Handler<any>};
}

export function putHandler(handlers: HandlerMap, namesapce: string, actionType: string, handler: Handler<any>): void {
    if (!handlers[actionType]) {
        handlers[actionType] = {};
    }
    handlers[actionType][namesapce] = handler;
}

export function metadata(handler: Handler<any>): HandlerMetadata {
    if (handler.meta) {
        return handler.meta;
    }
    return {effect: false};
}

export function* run(handler: Handler<any>, payload?: any, state?: any, rootState?: any) {
    const loading = handler.meta && handler.meta.loading;
    try {
        if (loading) {
            yield put(updateLoadingAction(handler.meta.qualifiedActionType, 1));
        }
        yield* handler(payload, state, rootState);
    } catch (error) {
        yield put(errorAction(error));
    } finally {
        if (loading) {
            yield put(updateLoadingAction(handler.meta.qualifiedActionType, -1));
        }
    }
}

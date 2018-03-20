import {put} from "redux-saga/effects";
import {errorAction} from "./action";
import {Handler} from "./type";
import {updateLoadingAction} from "./loading";

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

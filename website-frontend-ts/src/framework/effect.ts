import {errorAction} from "./action";
import {put} from "redux-saga/effects";
import {Handler} from "./type";

export function* run(handler: Handler<any>, payload?: any, state?: any, rootState?: any) {
    try {
        yield* handler(payload, state, rootState);
    } catch (error) {
        yield put(errorAction(error));
    }
}

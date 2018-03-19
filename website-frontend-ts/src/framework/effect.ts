import {put, takeLatest as sagaTakeLatest} from "redux-saga/effects";
import {hideAction, showAction} from "./component/loading";
import {errorAction} from "../framework_v2/action";

export function* takeLatestWithLoading(actionType: any, worker: any) {
    yield sagaTakeLatest(actionType, function* (action) {
        try {
            yield put(showAction(actionType));
            yield worker(action);
            yield put(hideAction(actionType));
        } catch (error) {
            yield put(errorAction(error));
        }
    });
}

export function* takeLatest(actionType: any, worker: any) {
    yield sagaTakeLatest(actionType, function* (action) {
        try {
            yield worker(action);
        } catch (error) {
            yield put(errorAction(error));
        }
    });
}

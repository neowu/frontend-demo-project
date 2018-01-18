import {put, takeLatest as sagaTakeLatest} from "redux-saga/effects";
import {errorAction} from "./action";
import {hideAction, showAction} from "./component/loading";

export function* takeLatestWithLoading(actionType, worker) {
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

export function* takeLatest(actionType, worker) {
    yield sagaTakeLatest(actionType, function* (action) {
        try {
            yield worker(action);
        } catch (error) {
            yield put(errorAction(error));
        }
    });
}

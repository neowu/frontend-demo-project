import {put, takeLatest as sagaTakeLatest} from "redux-saga/effects";

export function* takeLatest(actionType, worker) {
    yield sagaTakeLatest(actionType, function* (action) {
        try {
            yield put({
                type: "LOADING/SHOW",
                actionType: actionType
            });
            yield worker(action);
            yield put({
                type: "LOADING/HIDE",
                actionType: actionType
            });
        } catch (error) {
            yield put({
                type: "ERROR",
                message: error.message,
                detail: JSON.stringify(error.detail)
            });
        }
    });
}

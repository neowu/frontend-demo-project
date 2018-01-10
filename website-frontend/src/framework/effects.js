import {put, takeLatest as sagaTakeLatest} from "redux-saga/effects";

function* notifyError(error) {
    yield put({
        type: "@@framework/ERROR",
        message: error.message,
        detail: JSON.stringify(error.detail)
    });
}

export function* takeLatestWithLoading(actionType, worker) {
    yield sagaTakeLatest(actionType, function* (action) {
        try {
            yield put({
                type: "@@framework/LOADING_SHOW",
                actionType: actionType
            });
            yield worker(action);
            yield put({
                type: "@@framework/LOADING_HIDE",
                actionType: actionType
            });
        } catch (error) {
            yield notifyError(error);
        }
    });
}

export function* takeLatest(actionType, worker) {
    yield sagaTakeLatest(actionType, function* (action) {
        try {
            yield worker(action);
        } catch (error) {
            yield notifyError(error);
        }
    });
}

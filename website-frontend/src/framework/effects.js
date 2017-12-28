import {put, takeLatest as sagaTakeLatest} from "redux-saga/effects";

export function* takeLatest(actionType, worker) {
    yield sagaTakeLatest(actionType, function* (action) {
        try {
            yield worker(action);
        } catch (error) {
            yield put({
                type: "ERROR",
                message: error.message,
                detail: JSON.stringify(error.detail)
            });
        }
    });
}

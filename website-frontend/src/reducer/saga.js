import {all, call, put, takeLatest} from "redux-saga/effects";
import {getCurrentUser} from "../service/userService";

function* watchCheckCurrentUser() {
    yield takeLatest("CHECK_CURRENT_USER", function* () {
        const {response, error} = yield call(getCurrentUser);
        if (response) {
            yield put({
                type: "GET_CURRENT_USER_SUCCESS",
                response: response
            });
        } else {
            yield put({
                type: "ERROR",
                error: error
            });
        }
    });
}

export default function* saga() {
    yield all([watchCheckCurrentUser()]);
}

import {all, call, put, takeLatest} from "redux-saga/effects";
import {getCurrentUser} from "../service/userService";

function* watchCheckLogin() {
    yield takeLatest("CHECK_LOGIN", function* () {
        const {response, error} = yield call(getCurrentUser);
        if (response) {
            yield put({
                type: "USER_IS_LOGGED_IN",
                response: response
            });
        } else {
            yield put({
                type: "USER_NOT_LOGGED_IN",
                error: error
            });
        }
    });
}

export default function* saga() {
    yield all([watchCheckLogin()]);
}

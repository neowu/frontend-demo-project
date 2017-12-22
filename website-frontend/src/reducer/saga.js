import {all, call, put, takeLatest} from "redux-saga/effects";
import {getCurrentUser} from "../service/userService";

function* test() {
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
}

function* watchCheckLogin() {
    yield takeLatest("CHECK_LOGIN", test);
}

export default function* saga() {
    yield all([watchCheckLogin()]);
}

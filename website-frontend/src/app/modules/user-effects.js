import {call, put, takeLatest} from "redux-saga/effects";
import {getCurrentUser, login, logout} from "../services/users";

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

function* watchLogin() {
    yield takeLatest("LOGIN", function* (action) {
        const {response, error} = yield call(login, action.username, action.password);
        if (response) {
            yield put({
                type: "LOGIN_RESULT",
                response: response
            });
            yield put({type: "CHECK_CURRENT_USER"}); // TODO: not ideal flow, should refresh only by one step in LOGIN_RESULT in reducer
        } else {
            yield put({
                type: "ERROR",
                error: error
            });
        }
    });
}

function* watchLogout() {
    yield takeLatest("LOGOUT", function* () {
        const {response, error} = yield call(logout);
        if (response === true) {
            yield put({type: "CHECK_CURRENT_USER"}); // TODO: not ideal flow, should refresh only by one step in LOGIN_RESULT in reducer
        } else {
            yield put({
                type: "ERROR",
                error: error
            });
        }
    });
}

const effects = [watchCheckCurrentUser, watchLogin, watchLogout];

export default effects;

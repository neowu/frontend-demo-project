import {call, put} from "redux-saga/effects";
import {push} from "react-router-redux";
import {takeLatest} from "../../framework/effect";
import {getCurrentUser, login, logout} from "../services/users";

function* watchCheckCurrentUser() {
    yield takeLatest("CHECK_CURRENT_USER", function* () {
        const response = yield call(getCurrentUser);
        yield put({
            type: "GET_CURRENT_USER_SUCCESS",
            response
        });
    });
}

function* watchLogin() {
    yield takeLatest("LOGIN", function* (action) {
        const response = yield call(login, action.request);
        yield put({
            type: "LOGIN_RESULT",
            response
        });
        if (response.success) {
            yield put(push("/"));
        }
    });
}

function* watchLogout() {
    yield takeLatest("LOGOUT", function* () {
        yield call(logout);
        yield put({
            type: "LOGIN_RESULT",
            response: {
                success: false
            }
        });
    });
}

const effects = [watchCheckCurrentUser, watchLogin, watchLogout];

export default effects;

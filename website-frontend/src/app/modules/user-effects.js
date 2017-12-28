import {call, put} from "redux-saga/effects";
import {takeLatest} from "../../framework/effects";
import {getCurrentUser, login, logout} from "../services/users";

function* watchCheckCurrentUser() {
    yield takeLatest("CHECK_CURRENT_USER", function* () {
        const response = yield call(getCurrentUser);
        yield put({
            type: "GET_CURRENT_USER_SUCCESS",
            loggedIn: response.loggedIn,
            role: response.role,
            name: response.name
        });
    });
}

function* watchLogin() {
    yield takeLatest("LOGIN", function* (action) {
        const response = yield call(login, action.username, action.password);
        yield put({
            type: "LOGIN_RESULT",
            success: response.success,
            error: response.error,
            name: response.name,
            role: response.role
        });
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

import {call, put} from "redux-saga/effects";
import {push} from "react-router-redux";
import {takeLatest} from "../framework/effect";
import userAJAXService from "../service/user";
import {Effect} from "../framework/application";
import {app} from "../service/api";
import CurrentUserAJAXResponse = app.api.user.CurrentUserAJAXResponse;
import LoginAJAXResponse = app.api.user.LoginAJAXResponse;

function* watchCheckCurrentUser() {
    yield takeLatest("CHECK_CURRENT_USER", function* () {
        const response: CurrentUserAJAXResponse = yield call(userAJAXService.currentUser);
        yield put({
            type: "GET_CURRENT_USER_SUCCESS",
            response,
        });
    });
}

function* watchLogin() {
    yield takeLatest("LOGIN", function* (action) {
        const response: LoginAJAXResponse = yield call(userAJAXService.login, action.request);
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
        yield call(userAJAXService.logout);
        yield put({
            type: "LOGIN_RESULT",
            response: {
                success: false
            }
        });
    });
}

const effects: Effect[] = [watchCheckCurrentUser, watchLogin, watchLogout];

export default effects;

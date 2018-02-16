import {put} from "redux-saga/effects";
import {push} from "react-router-redux";
import {takeLatest} from "../../framework/effect";
import message from "antd/lib/message";
import {Module} from "../../framework/application";

require("antd/lib/message/style");

function* watchError() {
    yield takeLatest("@@framework/ERROR/XXX", function* (action) {
        // if (action.error instanceof ComponentException) {
        //     console.warn(action.error);
        // } else if (action.error instanceof APIException) {
        //     console.error(action.error);
        // }
        yield put(push("/error"));
    });
}

const state = {};

const module: Module = {
    state,
    reducers: {
        "@@framework/ERROR": (state, action) => {
            message.error(action.error.message, 5);
            return state;
        }
    },
    effects: [watchError]
};

export default module;

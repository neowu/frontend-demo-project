import {actions, Actions, namespace, State} from "./type";
import {push} from "connected-react-router";
import {call, put} from "redux-saga/effects";
import {effect, Listener, module} from "framework";
import {app} from "type/api";
import userAJAXService from "./ajax/user";
import LoginForm from "./component/LoginForm";
import CurrentUserAJAXResponse = app.api.user.CurrentUserAJAXResponse;
import LoginAJAXResponse = app.api.user.LoginAJAXResponse;

const initialState: State = {
    currentUser: {
        loggedIn: false,
        role: null,
        name: null
    },
    login: {
        success: false,
        errorMessage: null
    }
};

class ActionHandler implements Actions {
    @effect()
    * logout() {
        yield call(userAJAXService.logout);
        yield put(actions.loginResult({success: false}));
    }

    @effect()
    * login(request: app.api.user.LoginAJAXRequest) {
        const response: LoginAJAXResponse = yield call(userAJAXService.login, request);
        yield put(actions.loginResult(response));
        if (response.success) {
            yield put(push("/"));
        }
    }

    populateCurrentUser(response: app.api.user.CurrentUserAJAXResponse, state: State = initialState): State {
        return {
            ...state,
            currentUser: {
                loggedIn: response.loggedIn,
                role: response.role,
                name: response.name
            }
        };
    }

    loginResult(response: app.api.user.LoginAJAXResponse, state: State = initialState): State {
        return {
            ...state,
            login: {
                success: response.success,
                errorMessage: response.errorMessage
            },
            currentUser: {
                loggedIn: response.success,
                role: response.role,
                name: response.name
            }
        };
    }
}

class ListenerImpl implements Listener {
    * onInitialized() {
        const response: CurrentUserAJAXResponse = yield call(userAJAXService.currentUser);
        yield put(actions.populateCurrentUser(response));
    }
}

export default module(namespace, {LoginForm}, new ActionHandler(), initialState, new ListenerImpl());

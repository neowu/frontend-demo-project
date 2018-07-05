import {push} from "connected-react-router";
import {actionCreator, effect, Listener, register, callAJAX} from "core-fe";
import {call, put} from "redux-saga/effects";
import userAJAXService from "service/AccountAJAXWebService";
import {CurrentUserAJAXResponse, LoginAJAXRequest, LoginAJAXResponse} from "type/api";
import LoginForm from "./component/LoginForm";
import {Actions, State} from "./type";

const initialState: State = {
    currentUser: {
        loggedIn: false,
        role: null,
        name: null,
    },
    login: {
        success: false,
        errorMessage: null,
    },
};

class ActionHandler implements Actions {
    @effect
    * logout() {
        yield call(userAJAXService.logout);
        yield put(actions.loginResult({success: false}));
    }

    @effect
    * login(request: LoginAJAXRequest) {
        const effect = callAJAX(userAJAXService.login, request);
        yield effect;
        const response = effect.response();
        yield put(actions.loginResult(response));
        if (response.success) {
            yield put(push("/"));
        }
    }

    populateCurrentUser(response: CurrentUserAJAXResponse, state: State = initialState): State {
        return {
            ...state,
            currentUser: {
                loggedIn: response.loggedIn,
                role: response.role,
                name: response.name,
            },
        };
    }

    loginResult(response: LoginAJAXResponse, state: State = initialState): State {
        return {
            ...state,
            login: {
                success: response.success,
                errorMessage: response.errorMessage,
            },
            currentUser: {
                loggedIn: response.success,
                role: response.role,
                name: response.name,
            },
        };
    }
}

class ListenerImpl implements Listener {
    * onInitialized() {
        const effect = callAJAX(userAJAXService.currentUser);
        yield effect;
        const response = effect.response();
        yield put(actions.populateCurrentUser(response));
    }
}

const namespace = "user";
const actions = actionCreator<Actions>(namespace, ActionHandler.prototype);
const handler = new ActionHandler();
const listener = new ListenerImpl();
register({namespace, handler, initialState, listener});
export {actions, LoginForm};

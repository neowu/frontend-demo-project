import {push} from "connected-react-router";
import {Listener, register, callAJAX, Handler, actionCreator, effect} from "core-fe";
import {call, put} from "redux-saga/effects";
import {AccountAJAXWebService} from "service/AccountAJAXWebService";
import {CurrentUserAJAXResponse, LoginAJAXRequest, LoginAJAXResponse} from "type/api";
import LoginForm from "./component/LoginForm";
import {State} from "./type";
import {SagaIterator} from "redux-saga";

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

class ActionHandler extends Handler<State> implements Listener {
    @effect
    *logout(): SagaIterator {
        yield call(AccountAJAXWebService.logout);
        yield put(actions.loginResult({success: false}));
    }

    @effect
    *login(username: string, password: string): SagaIterator {
        const effect = callAJAX(AccountAJAXWebService.login, {username, password});
        yield effect;
        const response = effect.response();
        yield put(actions.loginResult(response));
        if (response.success) {
            yield put(push("/"));
        }
    }

    populateCurrentUser(response: CurrentUserAJAXResponse): State {
        return {
            ...this.state,
            currentUser: {
                loggedIn: response.loggedIn,
                role: response.role,
                name: response.name,
            },
        };
    }

    loginResult(response: LoginAJAXResponse): State {
        return {
            ...this.state,
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

    *onInitialized() {
        const effect = callAJAX(AccountAJAXWebService.currentUser);
        yield effect;
        const response = effect.response();
        yield put(actions.populateCurrentUser(response));
    }
}

const handler = new ActionHandler("user", initialState);
const actions = actionCreator(handler);
register(handler);
export {actions, LoginForm};

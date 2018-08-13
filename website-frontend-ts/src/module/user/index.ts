import {push} from "connected-react-router";
import {actionCreator, call, Handler, Listener, register} from "core-fe";
import {put} from "redux-saga/effects";
import {AccountAJAXWebService} from "service/AccountAJAXWebService";
import LoginForm from "./component/LoginForm";
import {State} from "./type";

const initialState: State = {
    currentUser: {
        loggedIn: false,
    },
    login: {
        success: false,
    },
};

class ActionHandler extends Handler<State> implements Listener {
    *logout() {
        yield call(AccountAJAXWebService.logout);
        yield* this.setState({
            login: {
                success: false,
            },
            currentUser: {
                loggedIn: false,
            },
        });
    }

    *login(username: string, password: string) {
        const effect = call(AccountAJAXWebService.login, {username, password});
        yield effect;
        const response = effect.result();
        yield* this.setState({
            login: {
                success: response.success,
                errorMessage: response.errorMessage,
            },
            currentUser: {
                loggedIn: response.success,
                role: response.role,
                name: response.name,
            },
        });
        if (response.success) {
            yield put(push("/"));
        }
    }

    *onInitialized() {
        const effect = call(AccountAJAXWebService.currentUser);
        yield effect;
        const response = effect.result();
        yield* this.setState({
            currentUser: {
                loggedIn: response.loggedIn,
                role: response.role,
                name: response.name,
            },
        });
    }
}

const handler = new ActionHandler("user", initialState);
const actions = actionCreator(handler);
register(handler);
export {actions, LoginForm};

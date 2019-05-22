import {call, Lifecycle, Module, register} from "core-fe";
import {AccountAJAXWebService} from "service/AccountAJAXWebService";
import {State} from "./type";
import {SagaIterator} from "redux-saga";

const initialState: State = {
    currentUser: {
        loggedIn: false,
        name: null,
        role: null,
    },
    login: {
        success: false,
        errorMessage: null,
    },
};

class UserModule extends Module<State, {}, {}> {
    *logout(): SagaIterator {
        yield call(AccountAJAXWebService.logout);
        this.setState({
            login: {
                success: false,
                errorMessage: null,
            },
            currentUser: {
                loggedIn: false,
                name: null,
                role: null,
            },
        });
    }

    *login(username: string, password: string): SagaIterator {
        const effect = call(AccountAJAXWebService.login, {username, password});
        yield effect;
        const response = effect.result();
        this.setState({
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
            this.setHistory("/");
        }
    }

    @Lifecycle()
    *onRender(): SagaIterator {
        const effect = call(AccountAJAXWebService.currentUser);
        yield effect;
        const response = effect.result();
        this.setState({
            currentUser: {
                loggedIn: response.loggedIn,
                role: response.role,
                name: response.name,
            },
        });
    }
}

const module = register(new UserModule("user", initialState));
export const actions = module.getActions();
export {default as LoginForm} from "./component/LoginForm";

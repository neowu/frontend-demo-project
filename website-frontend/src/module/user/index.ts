import {call, Module, register, SagaGenerator} from "core-fe";
import {AccountAJAXWebService} from "service/AccountAJAXWebService";
import {RootState} from "type/state";
import {State} from "./type";

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

class UserModule extends Module<RootState, "user", {}, {}> {
    override *onLocationMatched(): SagaGenerator {
        const response = yield* call(AccountAJAXWebService.currentUser);
        this.setState({
            currentUser: {
                loggedIn: response.loggedIn,
                role: response.role,
                name: response.name,
            },
        });
    }

    *logout(): SagaGenerator {
        yield* call(AccountAJAXWebService.logout);
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

    *login(username: string, password: string): SagaGenerator {
        const response = yield* call(AccountAJAXWebService.login, {username, password});
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
            yield* this.pushHistory("/");
        }
    }
}

const module = register(new UserModule("user", initialState));
export const actions = module.getActions();
export {default as LoginForm} from "./component/LoginForm";
export {UserModule, initialState};

import {Lifecycle, register, Module} from "core-native";
import {SagaIterator} from "redux-saga";
import {State} from "./type";
import LoginMain from "./component/Main";

const initialState: State = {};

class LoginModule extends Module<State> {
    @Lifecycle()
    *onEnter(): SagaIterator {
        // TODO
    }
}

const module = register(new LoginModule("login", initialState));
export const actions = module.getActions();
export const LoginComponent = module.attachLifecycle(LoginMain);

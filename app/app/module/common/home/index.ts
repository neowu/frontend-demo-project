import {Navigation} from "app/module/Navigation";
import {Module, register} from "core-native";
import {SagaIterator} from "redux-saga";
import HomeMain from "./component/Main";
import {State} from "./type";

const initialState: State = {};

class HomeModule extends Module<State> {
    *goLogin(): SagaIterator {
        Navigation.switch("Login");
    }
}

const module = register(new HomeModule("home", initialState));
export const actions = module.getActions();
export const HomeComponent = module.attachLifecycle(HomeMain);

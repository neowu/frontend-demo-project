import {Lifecycle, Module, register} from "core-native";
import {SagaIterator} from "redux-saga";
import {NavigationService} from "../../../service/NavigationService";
import HomeMain from "./component/Main";
import {State} from "./type";

const initialState: State = {};

class HomeModule extends Module<State> {
    @Lifecycle()
    *onEnter(): SagaIterator {
        // TODO
    }

    *goLogin(): SagaIterator {
        NavigationService.switch("Login");
    }
}

const module = register(new HomeModule("home", initialState));
export const actions = module.getActions();
export const HomeComponent = module.attachLifecycle(HomeMain);

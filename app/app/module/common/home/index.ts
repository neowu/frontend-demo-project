import {Lifecycle, Module, register} from "core-native";
import {SagaIterator} from "redux-saga";
import HomeMain from "./component/Main";
import {State} from "./type";

const initialState: State = {};

class HomeModule extends Module<State> {
    @Lifecycle()
    *onEnter(): SagaIterator {
        // TODO
    }
}

const module = register(new HomeModule("home", initialState));
export const actions = module.getActions();
export const HomeComponent = module.attachLifecycle(HomeMain);

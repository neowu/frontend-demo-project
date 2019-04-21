import {Lifecycle, register, Module} from "app/framework";
import {SagaIterator} from "redux-saga";
import {State} from "./type";
import {2}Main from "./component/Main";

const initialState: State = {};

class {2}Module extends Module<State> {
    @Lifecycle()
    *onEnter(): SagaIterator {
        // TODO
    }
}

const module = register(new {2}Module("{1}", initialState));
export const actions = module.getActions();
export const {2}Component = module.attachLifecycle({2}Main);

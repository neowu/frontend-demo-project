import {message} from "antd";
import {Module, register, Exception} from "core-fe";
import {SagaIterator} from "redux-saga";
import MainComponent from "./component/Main";

class MainModule extends Module<{}> {
    *onError(error: Exception): SagaIterator {
        message.error(error.message, 5);
    }
}

const module = register(new MainModule("main", {}));
export const Main = module.attachLifecycle(MainComponent);

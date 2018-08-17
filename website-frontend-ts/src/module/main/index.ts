import {message} from "antd";
import {Handler, Listener, register, Exception} from "core-fe";
import {SagaIterator} from "redux-saga";
import Main from "./component/Main";

class ActionHandler extends Handler<{}> implements Listener {
    *onError(error: Exception): SagaIterator {
        message.error(error.message, 5);
    }
}

register(new ActionHandler("main", {}));
export {Main};

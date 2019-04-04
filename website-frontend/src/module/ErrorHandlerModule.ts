import {message} from "antd";
import {ErrorListener, Exception, Module} from "core-fe";
import {SagaIterator} from "redux-saga";

export class ErrorHandlerModule extends Module<{}> implements ErrorListener {
    *onError(exception: Exception): SagaIterator {
        message.error(exception.message, 5);
    }
}

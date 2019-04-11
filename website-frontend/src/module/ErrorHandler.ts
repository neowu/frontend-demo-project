import {message} from "antd";
import {ErrorListener, Exception} from "core-fe";
import {SagaIterator} from "redux-saga";

export class ErrorHandler implements ErrorListener {
    *onError(exception: Exception): SagaIterator {
        message.error(exception.message, 5);
    }
}

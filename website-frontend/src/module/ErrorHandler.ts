import {message} from "antd";
import {ErrorListener, Exception, SagaGenerator} from "core-fe";

export class ErrorHandler implements ErrorListener {
    *onError(exception: Exception): SagaGenerator {
        message.error(exception.message, 5);
    }
}

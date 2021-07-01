import {message} from "antd";
import {ErrorListener, Exception, SagaGenerator} from "core-fe";

export class ErrorHandler implements ErrorListener {
    *onError(exception: Exception): SagaGenerator {
        // in dev mode, it will show error twice which is expected, refer to https://github.com/facebook/react/issues/10474
        message.error(exception.message, 5);
    }
}

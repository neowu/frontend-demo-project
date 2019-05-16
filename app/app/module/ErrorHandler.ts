import {ErrorListener, Exception} from "core-native";
import {SagaIterator} from "redux-saga";

export class ErrorHandler implements ErrorListener {
    *onError(error: Exception): SagaIterator {
        console.error(error);
    }
}

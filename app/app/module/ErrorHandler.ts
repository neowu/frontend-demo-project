import {ErrorListener, Exception} from "core-native";
import {Toast} from "native-base";
import {SagaIterator} from "redux-saga";

export class ErrorHandler implements ErrorListener {
    * onError(error: Exception): SagaIterator {
        Toast.show({
            text: error.message,
            buttonText: "Okay",
            duration: 3000,
        });
    }
}

import {OverlayManager} from "app/component/library";
import {ErrorListener, Exception} from "core-native";
import {SagaIterator} from "redux-saga";

export class ErrorHandler implements ErrorListener {
    * onError(error: Exception): SagaIterator {
        OverlayManager.pushActionModal({
            title: "error",
            body: error.message.substr(0, 100),
        });
    }
}

import {NavigationService} from "app/service/NavigationService";
import {RootState} from "app/type/state";
import {call, createActionHandlerDecorator, NetworkConnectionException} from "core-native";
import {call as sagaCall, delay, race} from "redux-saga/effects";

export function GoBackOnError() {
    return createActionHandlerDecorator<RootState>(function*(handler) {
        try {
            yield* handler();
        } catch (e) {
            NavigationService.goBack();
            throw e; // Propagate to global error handler
        }
    });
}

export function RetryOnNetworkConnectionError(retryIntervalSecond: number = 10) {
    return createActionHandlerDecorator(function*(handler) {
        while (true) {
            try {
                yield* handler();
                break;
            } catch (e) {
                if (e instanceof NetworkConnectionException) {
                    yield delay(retryIntervalSecond * 1000);
                } else {
                    throw e;
                }
            }
        }
    });
}

// Useful for periodical action
export function SilentOnNetworkConnectionError() {
    return createActionHandlerDecorator(function*(handler) {
        try {
            yield* handler();
        } catch (e) {
            if (!(e instanceof NetworkConnectionException)) {
                throw e;
            }
        }
    });
}

export function TimeLimit(second: number, timeOutErrorMessage: string = "Time Out") {
    return createActionHandlerDecorator(function*(handler) {
        // Auto cancelled if lost in race
        const {timerExecution} = yield race({
            actionExecution: sagaCall(handler),
            timerExecution: delay(second * 1000),
        });
        if (timerExecution) {
            throw new NetworkConnectionException(`#${timeOutErrorMessage}#`);
        }
    });
}

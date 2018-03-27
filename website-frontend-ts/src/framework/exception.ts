import {Action} from "./action";

export interface Exception {
    message: string;
}

export const ErrorActionType: string = "@@framework/error";

export function errorAction(error: Exception): Action<Exception> {
    return {
        type: ErrorActionType,
        payload: error
    };
}

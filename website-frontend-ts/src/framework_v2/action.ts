import {Action} from "./type";
import {LOCATION_CHANGE} from "connected-react-router";

export const ErrorActionType: string = "@@framework/error";
export const LocationChangedActionType: string = LOCATION_CHANGE;
export const InitializeStateActionType: string = "@@framework/initializeState";

export function errorAction(error: any): Action {
    return {
        type: ErrorActionType,
        data: error
    };
}

export function initializeStateAction(namespace: string, state: any): Action {
    return {
        type: InitializeStateActionType,
        data: {namespace, state}
    };
}

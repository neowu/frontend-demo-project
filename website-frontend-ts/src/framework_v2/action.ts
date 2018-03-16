import {Location} from "history";
import {Action} from "./type";

export const ErrorActionType: string = "@@framework/error";
export const LocationChangedActionType: string = "@@framework/locationChanged";

export function errorAction(error: any): Action {
    return {
        type: ErrorActionType,
        data: error
    };
}

export function locationChangedAction(location: Location) {
    return {
        type: LocationChangedActionType,
        data: location
    };
}

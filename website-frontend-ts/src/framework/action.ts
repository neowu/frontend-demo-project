import {LOCATION_CHANGE} from "connected-react-router";
import {Action as ReduxAction} from "redux";

export interface Action extends ReduxAction {
    type: string;
    payload: any;
}

export const ErrorActionType: string = "@@framework/error";
export const LocationChangedActionType: string = LOCATION_CHANGE;
export const InitializeStateActionType: string = "@@framework/initializeState";

export function initializeStateAction(namespace: string, state: any): Action {
    return {
        type: InitializeStateActionType,
        payload: {namespace, state}
    };
}

export function errorAction(error: any): Action {
    return {
        type: ErrorActionType,
        payload: error
    };
}

export function actionCreator<T>(namespace: string): T {
    return new Proxy({}, {
            get: (target: {}, key: string) => {
                return (payload: any): Action => {
                    const type = key.charAt(0) === "_" ? key : `${namespace}/${key}`;
                    return {type, payload};
                };
            }
        }
    ) as T;
}

export function actionType<T>(namespace: string): T {
    return new Proxy({}, {
            get: (target: {}, key: string) => {
                return (): string => {
                    return key.charAt(0) === "_" ? key : `${namespace}/${key}`;
                };
            }
        }
    ) as T;
}

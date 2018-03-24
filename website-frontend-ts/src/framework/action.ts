import {LOCATION_CHANGE} from "connected-react-router";
import {Action as ReduxAction} from "redux";
import {Handler} from "./handler";

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

type ActionCreator = (payload: any) => Action;

export function actionCreator<A extends any>(namespace: string, actionHandler: A): A {
    const actionCreators: A = {} as A;
    Object.keys(actionHandler.__proto__).forEach(actionType => {
        const handler: Handler<any> = actionHandler[actionType];
        const qualifiedActionType = handler.global ? actionType : `${namespace}/${actionType}`;
        actionCreators[actionType] = ((payload: any) => ({type: qualifiedActionType, payload})) as ActionCreator;
    });
    return actionCreators;
}

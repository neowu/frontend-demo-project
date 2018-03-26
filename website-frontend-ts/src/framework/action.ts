import {LOCATION_CHANGE} from "connected-react-router";
import {Action as ReduxAction} from "redux";
import {Handler, qualifiedActionType} from "./handler";

export interface Action<P> extends ReduxAction {
    type: string;
    payload: P;
}

export const ErrorActionType: string = "@@framework/error";
export const LocationChangedActionType: string = LOCATION_CHANGE;
export const InitializeStateActionType: string = "@@framework/initializeState";

interface InitializeStateActionPayload {
    namespace: string;
    state: any;
}

export function initializeStateAction(namespace: string, state: any): Action<InitializeStateActionPayload> {
    return {
        type: InitializeStateActionType,
        payload: {namespace, state}
    };
}

export function errorAction(error: any): Action<any> {
    return {
        type: ErrorActionType,
        payload: error
    };
}

type ActionCreator = (payload: any) => Action<any>;

export function actionCreator<A>(namespace: string, actionHandler: A): {[P in keyof A]?: ActionCreator; } {
    const actionCreators = {};
    Object.keys(Object.getPrototypeOf(actionHandler)).forEach(actionType => {
        const handler: Handler = actionHandler[actionType];
        const type = qualifiedActionType(handler, namespace, actionType);
        actionCreators[actionType] = ((payload: any) => ({type, payload}));
    });
    return actionCreators;
}

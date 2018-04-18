import {Action as ReduxAction} from "redux";
import {Handler, qualifiedActionType} from "./handler";
import {State} from "./state";

export interface Action<P> extends ReduxAction {
    type: string;
    payload: P;
}

export const INIT_STATE_ACTION_TYPE: string = "@@framework/initState";

interface InitStateActionPayload {
    namespace: string;
    state: any;
}

export function initStateAction(namespace: string, state: any): Action<InitStateActionPayload> {
    return {
        type: INIT_STATE_ACTION_TYPE,
        payload: {namespace, state},
    };
}

export function initStateReducer(state: State["app"] = {}, action: Action<InitStateActionPayload>): State["app"] {
    const {namespace, state: initialState} = action.payload;
    return {...state, [namespace]: initialState};
}

type ActionCreator = <P>(payload?: P) => Action<P>;

// usage: const actions = actionCreator(namespace, ActionHandler.prototype);
export function actionCreator<H>(namespace: string, handlerPrototype: H): {readonly [P in keyof H]?: ActionCreator} {
    const actionCreators = {};
    Object.keys(handlerPrototype).forEach(actionType => {
        const handler: Handler = handlerPrototype[actionType];
        const type = qualifiedActionType(handler, namespace, actionType);
        actionCreators[actionType] = (payload?: any) => ({type, payload});
    });
    return actionCreators;
}

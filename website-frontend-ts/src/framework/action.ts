import {Action as ReduxAction, Reducer} from "redux";
import {Handler, qualifiedActionType} from "./handler";

export interface Action<P> extends ReduxAction {
    type: string;
    payload: P;
}

const InitializeStateActionType: string = "@@framework/initializeState";

interface InitializeStateActionPayload {
    namespace: string;
    state: any;
}

export function initializeStateAction(namespace: string, state: any): Action<InitializeStateActionPayload> {
    return {
        type: InitializeStateActionType,
        payload: {namespace, state},
    };
}

export function initializeStateReducer(next: Reducer<any>): Reducer<any> {
    return (state: any = {}, action: Action<InitializeStateActionPayload>): any => {
        switch (action.type) {
            case InitializeStateActionType:
                const {namespace, state: initialState} = action.payload;
                return {...state, [namespace]: initialState};
            default:
                return next(state, action);
        }
    };
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

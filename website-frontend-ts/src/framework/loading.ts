import {Action} from "./action";

export interface LoadingState {
    loading: {[actionType: string]: number};    // use number to track loading status, because for global action type, there may be multiple effects listen to it, hide loading component when status reduce to 0
}

interface LoadingActionPayload {
    actionType: string;
    show: boolean;
}

const LoadingActionType: string = "@@framework/loading";
const initialLoadingState: LoadingState = {loading: {}};

export function loadingAction(actionType: string, show: boolean): Action {
    const payload: LoadingActionPayload = {actionType, show};
    return {
        type: LoadingActionType,
        payload
    };
}

export function loadingReducer(state = initialLoadingState, action: Action): LoadingState {
    switch (action.type) {
        case LoadingActionType:
            const payload: LoadingActionPayload = action.payload;
            const count = state[payload.actionType] ? state[payload.actionType] : 0;
            return {
                ...state,
                [payload.actionType]: count + (payload.show ? 1 : -1)
            };
        default:
            return state;
    }
}

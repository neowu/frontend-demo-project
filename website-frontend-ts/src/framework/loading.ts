import {Action} from "./type";

export interface LoadingState {
    loading: {[actionType: string]: number};    // use number to track loading status, because for global action type, there may be multiple effects listen to it, hide loading component when status reduce to 0
}

interface UpdateLoadingActionPayload {
    actionType: string;
    update: number;
}

const UpdateLoadingActionType: string = "@@framework/updateLoading";
const initialLoadingState: LoadingState = {loading: {}};

export function updateLoadingAction(actionType: string, update: number): Action {
    const payload: UpdateLoadingActionPayload = {actionType, update};
    return {
        type: UpdateLoadingActionType,
        payload
    };
}

export function updateLoadingReducer(state = initialLoadingState, action: Action): LoadingState {
    switch (action.type) {
        case UpdateLoadingActionType:
            const payload: UpdateLoadingActionPayload = action.payload;
            const count = state[payload.actionType] ? state[payload.actionType] : 0;
            return {
                ...state,
                [payload.actionType]: count + payload.update
            };
        default:
            return state;
    }
}

export const ErrorActionType: string = "@@framework/ERROR";

export function errorAction(error: any) {
    return {
        type: ErrorActionType,
        error
    };
}

export function errorAction(error: any) {
    return {
        type: "@@framework/ERROR",
        error
    };
}

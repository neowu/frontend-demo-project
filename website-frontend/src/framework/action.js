export function errorAction(error) {
    return {
        type: "@@framework/ERROR",
        error
    };
}

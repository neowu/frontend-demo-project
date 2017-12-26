export default function header(state, action) {
    switch (action.type) {
        case "GET_CURRENT_USER_SUCCESS":
            return {
                ...state,
                currentUser: {
                    loggedIn: action.response.loggedIn,
                    role: action.response.role,
                    name: action.response.name
                }
            };
        case "LOGIN_RESULT":
            return {
                ...state,
                login: {
                    success: action.response.success,
                    error: action.response.error
                }
            };
        case "ERROR":
            return {
                ...state,
                error: {
                    hasError: true,
                    error: action.error
                }
            };
        default:
            return state;
    }
}

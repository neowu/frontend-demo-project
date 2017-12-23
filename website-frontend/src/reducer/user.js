const defaultState = {
    currentUser: {
        loggedIn: false,
        role: null,
        name: null
    },
    error: {
        hasError: false
    }
};

export default function header(state = defaultState, action) {
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
        case "ERROR":
            return {
                ...state,
                error: {
                    hasError: true
                }
            };
        default:
            return state;
    }
}

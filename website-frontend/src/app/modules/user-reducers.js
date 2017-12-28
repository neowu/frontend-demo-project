function getCurrentUserReducer(state, action) {
    return {
        ...state,
        currentUser: {
            loggedIn: action.loggedIn,
            role: action.role,
            name: action.name
        }
    };
}

const reducers = {
    "GET_CURRENT_USER_SUCCESS": getCurrentUserReducer,
    "LOGIN_RESULT": (state, action) => ({
        ...state,
        login: {
            success: action.success,
            error: action.error
        },
        currentUser: {
            loggedIn: action.success,
            role: action.role,
            name: action.name
        }
    })
};

export default reducers;

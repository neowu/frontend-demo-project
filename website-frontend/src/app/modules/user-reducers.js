function getCurrentUserReducer(state, action) {
    return {
        ...state,
        currentUser: {
            loggedIn: action.response.loggedIn,
            role: action.response.role,
            name: action.response.name
        }
    };
}

const reducers = {
    "GET_CURRENT_USER_SUCCESS": getCurrentUserReducer,
    "LOGIN_RESULT": (state, action) => ({
        ...state,
        login: {
            success: action.response.success,
            error: action.response.error
        }
    })
};

export default reducers;

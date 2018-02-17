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
    GET_CURRENT_USER_SUCCESS: getCurrentUserReducer,
    LOGIN_RESULT: (state, action) => ({
        ...state,
        login: {
            success: action.response.success,
            errorMessage: action.response.errorMessage
        },
        currentUser: {
            loggedIn: action.response.success,
            role: action.response.role,
            name: action.response.name
        }
    })
};

export default reducers;

import {app} from "../service/api";
import LoginAJAXResponse = app.api.user.LoginAJAXResponse;
import CurrentUserAJAXResponse = app.api.user.CurrentUserAJAXResponse;

function getCurrentUserReducer(state, action) {
    const response: CurrentUserAJAXResponse = action.response;
    return {
        ...state,
        currentUser: {
            loggedIn: response.loggedIn,
            role: response.role,
            name: response.name
        }
    };
}

const reducers = {
    GET_CURRENT_USER_SUCCESS: getCurrentUserReducer,
    LOGIN_RESULT: (state, action) => {
        const response: LoginAJAXResponse = action.response;
        return {
            ...state,
            login: {
                success: response.success,
                errorMessage: response.errorMessage
            },
            currentUser: {
                loggedIn: response.success,
                role: response.role,
                name: response.name
            }
        };
    }
};

export default reducers;

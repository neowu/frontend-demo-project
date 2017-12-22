export default function header(state = {loggedIn: false}, action) {
    switch (action.type) {
        case "USER_IS_LOGGED_IN":
            return {
                loggedIn: true,
                loginUserName: action.response.userName
            };
        case "USER_NOT_LOGGED_IN":
            return {loggedIn: false};
        default:
            return state;
    }
}

import {CurrentUserAJAXResponse, LoginAJAXRequest, LoginAJAXResponse} from "../../type/api";

export interface State {
    currentUser: {
        loggedIn: boolean;
        role: string;
        name: string;
    };
    login: {
        success: boolean;
        errorMessage: string;
    };
}

export interface Actions {
    populateCurrentUser(response: CurrentUserAJAXResponse);

    loginResult(response: LoginAJAXResponse);

    login(request: LoginAJAXRequest);

    logout();
}

import {app} from "type/api";
import CurrentUserAJAXResponse = app.api.user.CurrentUserAJAXResponse;
import LoginAJAXRequest = app.api.user.LoginAJAXRequest;
import LoginAJAXResponse = app.api.user.LoginAJAXResponse;

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

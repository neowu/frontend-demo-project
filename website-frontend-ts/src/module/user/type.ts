import {app} from "type/api";
import LoginAJAXResponse = app.api.user.LoginAJAXResponse;
import CurrentUserAJAXResponse = app.api.user.CurrentUserAJAXResponse;

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

    login(request: app.api.user.LoginAJAXRequest);

    logout();
}

import {app} from "type/api";
import {actionCreator} from "framework_v2";
import LoginAJAXResponse = app.api.user.LoginAJAXResponse;
import CurrentUserAJAXResponse = app.api.user.CurrentUserAJAXResponse;

export const namespace = "user";

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

export const actions = actionCreator<Actions>(namespace);

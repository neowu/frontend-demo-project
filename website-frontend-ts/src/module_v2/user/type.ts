import {app} from "../../service/api";
import {actionCreator} from "../../framework_v2/actionCreator";
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
    getCurrentUserSuccess(response: CurrentUserAJAXResponse);

    loginResult(response: LoginAJAXResponse);

    _login(request: app.api.user.LoginAJAXRequest);

    _logout();
}

export const actions = actionCreator<Actions>(namespace);

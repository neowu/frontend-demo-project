import {CurrentUserAJAXResponse, LoginAJAXRequest, LoginAJAXResponse} from "type/api";
import {ajax} from "core-fe";

export class AccountAJAXWebService {
    static currentUser(): Promise<CurrentUserAJAXResponse> {
        return ajax("GET", "/ajax/currentUser", {}, null);
    }
    static login(request: LoginAJAXRequest): Promise<LoginAJAXResponse> {
        return ajax("PUT", "/ajax/login", {}, request);
    }
    static logout(): Promise<void> {
        return ajax("PUT", "/ajax/logout", {}, null);
    }
}

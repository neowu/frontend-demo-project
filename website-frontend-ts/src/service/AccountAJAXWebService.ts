import {CurrentUserAJAXResponse, LoginAJAXRequest, LoginAJAXResponse} from "type/api";
import {ajax} from "framework/ajax";

class AccountAJAXWebService {
    currentUser(): Promise<CurrentUserAJAXResponse> {
        return ajax("GET", "/ajax/currentUser", {}, null);
    }
    login(request: LoginAJAXRequest): Promise<LoginAJAXResponse> {
        return ajax("PUT", "/ajax/login", {}, request);
    }
    logout(): Promise<void> {
        return ajax("PUT", "/ajax/logout", {}, null);
    }
}
export default new AccountAJAXWebService();

import {CurrentUserAJAXResponse, LoginAJAXRequest, LoginAJAXResponse} from "type/api";
import {ajax} from "framework/ajax";

class AccountAJAXWebService {
    currentUser(): Promise<CurrentUserAJAXResponse> {
        return ajax("/ajax/currentUser", "GET", null);
    }
    login(request: LoginAJAXRequest): Promise<LoginAJAXResponse> {
        return ajax("/ajax/login", "PUT", request);
    }
    logout(): Promise<void> {
        return ajax("/ajax/logout", "PUT", null);
    }
}
export default new AccountAJAXWebService();

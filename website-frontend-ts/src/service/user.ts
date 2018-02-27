import {ajax} from "framework/ajax";
import {app} from "./api";
import AccountAJAXWebService = app.api.AccountAJAXWebService;
import AccountAJAXWebServiceMeta = app.api.AccountAJAXWebServiceMeta;

class AccountAJAXWebServiceImpl implements AccountAJAXWebService {
    public currentUser(): Promise<app.api.user.CurrentUserAJAXResponse> {
        return ajax(AccountAJAXWebServiceMeta.currentUser.path, AccountAJAXWebServiceMeta.currentUser.method, {});
    }

    public login(request: app.api.user.LoginAJAXRequest): Promise<app.api.user.LoginAJAXResponse> {
        return ajax(AccountAJAXWebServiceMeta.login.path, AccountAJAXWebServiceMeta.login.method, request);
    }

    public logout(): Promise<void> {
        return ajax(AccountAJAXWebServiceMeta.logout.path, AccountAJAXWebServiceMeta.logout.method, null);
    }
}

export default new AccountAJAXWebServiceImpl();

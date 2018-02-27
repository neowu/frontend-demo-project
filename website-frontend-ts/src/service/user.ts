import {ajax} from "framework/ajax";
import {app} from "./api";
import AccountAJAXWebService = app.api.AccountAJAXWebService;
import AccountAJAXWebServiceMetadata = app.api.AccountAJAXWebServiceMetadata;

class AccountAJAXWebServiceImpl implements AccountAJAXWebService {
    currentUser(): Promise<app.api.user.CurrentUserAJAXResponse> {
        const meta = AccountAJAXWebServiceMetadata.currentUser;
        return ajax(meta.path, meta.method, {});
    }

    login(request: app.api.user.LoginAJAXRequest): Promise<app.api.user.LoginAJAXResponse> {
        const meta = AccountAJAXWebServiceMetadata.login;
        return ajax(meta.path, meta.method, request);
    }

    logout(): Promise<void> {
        const meta = AccountAJAXWebServiceMetadata.login;
        return ajax(meta.path, meta.method, null);
    }
}

export default new AccountAJAXWebServiceImpl();

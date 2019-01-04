package app.web.controller;

import app.api.AccountAJAXWebService;
import app.api.user.CurrentUserAJAXResponse;
import app.api.user.LoginAJAXRequest;
import app.api.user.LoginAJAXResponse;
import app.web.Sessions;
import app.web.session.LoginUser;
import core.framework.inject.Inject;
import core.framework.web.WebContext;

/**
 * @author neo
 */
public class AccountAJAXWebServiceImpl implements AccountAJAXWebService {
    @Inject
    WebContext context;

    @Override
    public LoginAJAXResponse login(LoginAJAXRequest request) {
        LoginAJAXResponse response = new LoginAJAXResponse();
        if ("user".equals(request.username) && "123".equals(request.password)) {
            LoginUser loginUser = new LoginUser();
            loginUser.userId = "1";
            loginUser.name = "user";
            loginUser.role = "user";
            Sessions.setLoginUser(context.request(), loginUser);
            response.success = Boolean.TRUE;
            response.name = "user";
            response.role = "user";
        } else if ("admin".equals(request.username) && "123".equals(request.password)) {
            LoginUser loginUser = new LoginUser();
            loginUser.userId = "2";
            loginUser.name = "admin";
            loginUser.role = "admin";
            Sessions.setLoginUser(context.request(), loginUser);
            response.success = Boolean.TRUE;
            response.name = "admin";
            response.role = "admin";
        } else {
            response.success = Boolean.FALSE;
            response.errorMessage = "login failed";
        }
        return response;
    }

    @Override
    public void logout() {
        context.request().session().invalidate();
    }

    @Override
    public CurrentUserAJAXResponse currentUser() {
        CurrentUserAJAXResponse response = new CurrentUserAJAXResponse();
        if (Sessions.isUserLogin(context.request())) {
            LoginUser loginUser = Sessions.loginUser(context.request());
            response.loggedIn = Boolean.TRUE;
            response.name = loginUser.name;
            response.role = loginUser.role;
        } else {
            response.loggedIn = Boolean.FALSE;
        }
        return response;
    }
}

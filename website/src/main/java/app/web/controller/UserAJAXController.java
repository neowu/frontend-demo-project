package app.web.controller;

import app.api.user.CurrentUserAJAXResponse;
import app.api.user.LoginAJAXRequest;
import app.api.user.LoginAJAXResponse;
import app.web.Sessions;
import app.web.session.LoginUser;
import core.framework.web.Request;
import core.framework.web.Response;

/**
 * @author neo
 */
public class UserAJAXController {
    public Response currentUser(Request request) {
        CurrentUserAJAXResponse response = new CurrentUserAJAXResponse();
        if (Sessions.isUserLogin(request)) {
            LoginUser loginUser = Sessions.loginUser(request);
            response.loggedIn = true;
            response.name = loginUser.name;
            response.role = loginUser.role;
        } else {
            response.loggedIn = false;
        }
        return Response.bean(response);
    }

    public Response login(Request request) {
        LoginAJAXResponse response = new LoginAJAXResponse();
        LoginAJAXRequest loginAJAXRequest = request.bean(LoginAJAXRequest.class);
        if ("user".equals(loginAJAXRequest.username) && "123".equals(loginAJAXRequest.password)) {
            LoginUser loginUser = new LoginUser();
            loginUser.userId = "1";
            loginUser.name = "user";
            loginUser.role = "user";
            Sessions.setLoginUser(request, loginUser);
            response.success = true;
            response.name = "user";
            response.role = "user";
        } else if ("admin".equals(loginAJAXRequest.username) && "123".equals(loginAJAXRequest.password)) {
            LoginUser loginUser = new LoginUser();
            loginUser.userId = "2";
            loginUser.name = "admin";
            loginUser.role = "admin";
            Sessions.setLoginUser(request, loginUser);
            response.success = true;
            response.name = "admin";
            response.role = "admin";
        } else {
            response.success = false;
            response.errorMessage = "login failed";
        }
        return Response.bean(response);
    }

    public Response logout(Request request) {
        request.session().invalidate();
        return Response.empty();
    }
}

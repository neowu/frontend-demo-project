package app.web;

import app.web.session.LoginUser;
import core.framework.json.JSON;
import core.framework.web.Request;
import core.framework.web.exception.UnauthorizedException;

/**
 * @author neo
 */
public final class Sessions {
    private static final String USER = "LOGIN_USER";

    public static boolean isUserLogin(Request request) {
        return request.session().get(USER).isPresent();
    }

    public static LoginUser loginUser(Request request) {
        String loginUser = request.session().get(USER).orElseThrow(() -> new UnauthorizedException("user not login"));
        return JSON.fromJSON(LoginUser.class, loginUser);
    }

    public static void setLoginUser(Request request, LoginUser user) {
        request.session().set(USER, JSON.toJSON(user));
    }
}

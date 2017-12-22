package app;

import app.web.LoginUser;
import core.framework.module.Module;
import core.framework.web.Response;

/**
 * @author neo
 */
public class WebModule extends Module {
    @Override
    protected void initialize() {
        route().get("/ajax/loginUser", request -> Response.bean(new LoginUser()));
    }
}

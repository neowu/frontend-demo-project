package app;

import app.web.HomeController;
import app.web.LoginUser;
import core.framework.module.Module;
import core.framework.web.Response;

/**
 * @author neo
 */
public class WebModule extends Module {
    @Override
    protected void initialize() {
        HomeController homeController = bind(HomeController.class);
        site().staticContent("/static");
        site().staticContent("/robots.txt");

        route().get("/", homeController::home);
        route().get("/:path(*)", homeController::home);

        route().get("/ajax/loginUser", request -> Response.bean(new LoginUser()));
    }
}

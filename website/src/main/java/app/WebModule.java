package app;

import app.web.controller.HomeController;
import app.web.controller.UserAJAXController;
import app.web.interceptor.LoginInterceptor;
import core.framework.module.Module;

/**
 * @author neo
 */
public class WebModule extends Module {
    @Override
    protected void initialize() {
        http().intercept(bind(LoginInterceptor.class));

        HomeController homeController = bind(HomeController.class);
        site().staticContent("/static");
        site().staticContent("/robots.txt");

        route().get("/", homeController::home);
        route().get("/:path(*)", homeController::home);

        UserAJAXController userAJAXController = bind(UserAJAXController.class);
        route().get("/ajax/currentUser", userAJAXController::currentUser);
        route().put("/ajax/login", userAJAXController::login);
    }
}

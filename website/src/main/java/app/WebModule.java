package app;

import app.api.AccountAJAXWebService;
import app.api.ProductAJAXWebService;
import app.web.WebsiteErrorHandler;
import app.web.controller.AccountAJAXWebServiceImpl;
import app.web.controller.HomeController;
import app.web.controller.ProductAJAXWebServiceImpl;
import app.web.interceptor.LoginInterceptor;
import core.framework.http.HTTPMethod;
import core.framework.module.Module;

/**
 * @author neo
 */
public class WebModule extends Module {
    @Override
    protected void initialize() {
        http().errorHandler(bind(WebsiteErrorHandler.class));
        http().intercept(bind(LoginInterceptor.class));

        site().staticContent("/static");
        site().staticContent("/robots.txt");

        HomeController homeController = bind(HomeController.class);
        http().route(HTTPMethod.GET, "/", homeController::home);
        http().route(HTTPMethod.GET, "/:path(*)", homeController::home);

        api().service(AccountAJAXWebService.class, bind(AccountAJAXWebServiceImpl.class));
        api().service(ProductAJAXWebService.class, bind(ProductAJAXWebServiceImpl.class));
    }
}

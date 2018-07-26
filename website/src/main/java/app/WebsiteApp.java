package app;

import core.framework.module.App;

/**
 * @author neo
 */
public class WebsiteApp extends App {
    @Override
    protected void initialize() {
        log().writeToConsole();
        http().httpsPort(8443);
        site().session().local();
        site().security();
        site().publishAPI();

        load(new WebModule());
    }
}

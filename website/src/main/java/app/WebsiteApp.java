package app;

import core.framework.module.App;

import java.util.List;

/**
 * @author neo
 */
public class WebsiteApp extends App {
    @Override
    protected void initialize() {
        log().appendToConsole();
        http().httpsPort(8443);
        site().session().local();
        site().security();
        site().publishAPI(List.of());

        load(new WebModule());
    }
}

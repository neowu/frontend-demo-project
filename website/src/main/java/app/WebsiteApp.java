package app;

import core.framework.module.App;

/**
 * @author neo
 */
public class WebsiteApp extends App {
    @Override
    protected void initialize() {
        log().writeActionLogToConsole();
        log().writeTraceLogToConsole();
        http().httpsPort(8443);
        site().session().local();
        site().enableWebSecurity();

        load(new WebModule());
    }
}

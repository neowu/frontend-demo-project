package app.web;

import core.framework.http.ContentType;
import core.framework.inject.Inject;
import core.framework.web.Request;
import core.framework.web.Response;
import core.framework.web.site.WebDirectory;

/**
 * @author neo
 */
public class HomeController {
    @Inject
    WebDirectory webDirectory;

    public Response home(Request request) {
        return Response.file(webDirectory.path("/index.html")).contentType(ContentType.TEXT_HTML);
    }
}

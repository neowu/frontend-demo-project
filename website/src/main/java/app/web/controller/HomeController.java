package app.web.controller;

import core.framework.http.ContentType;
import core.framework.inject.Inject;
import core.framework.web.Request;
import core.framework.web.Response;
import core.framework.web.exception.NotFoundException;
import core.framework.web.site.WebDirectory;

/**
 * @author neo
 */
public class HomeController {
    @Inject
    WebDirectory webDirectory;

    public Response home(Request request) {
        if (request.path().startsWith("/ajax/")) throw new NotFoundException("not found");

        return Response.file(webDirectory.path("/index.html")).contentType(ContentType.TEXT_HTML);
    }
}

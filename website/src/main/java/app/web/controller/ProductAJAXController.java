package app.web.controller;

import core.framework.web.Request;
import core.framework.web.Response;

/**
 * @author neo
 */
public class ProductAJAXController {
    public Response listProducts(Request request) throws InterruptedException {
        Thread.sleep(5000);
        return Response.empty();
    }
}

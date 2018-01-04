package app.web.controller;

import app.api.product.CreateProductConfigResponse;
import core.framework.util.Lists;
import core.framework.web.Request;
import core.framework.web.Response;

/**
 * @author neo
 */
public class ProductAJAXController {
    public Response listProducts(Request request) throws InterruptedException {
        Thread.sleep(3000);
        return Response.empty();
    }

    public Response createConfig(Request request) {
        CreateProductConfigResponse response = new CreateProductConfigResponse();
        response.types = Lists.newArrayList();
        response.types.add(type("type1", "1"));
        response.types.add(type("type2", "2"));
        return Response.bean(response);
    }

    private CreateProductConfigResponse.ProductType type(String name, String value) {
        CreateProductConfigResponse.ProductType type = new CreateProductConfigResponse.ProductType();
        type.name = name;
        type.value = value;
        return type;
    }
}

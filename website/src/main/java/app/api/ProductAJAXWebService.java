package app.api;

import app.api.product.CreateProductConfigResponse;
import app.api.product.GetProductResponse;
import app.api.product.ListProductResponse;
import core.framework.api.web.service.GET;
import core.framework.api.web.service.Path;
import core.framework.api.web.service.PathParam;

public interface ProductAJAXWebService {
    @GET
    @Path("/ajax/product")
    ListProductResponse list();

    @GET
    @Path("/ajax/product/create-config")
    CreateProductConfigResponse createConfig();

    @GET
    @Path("/ajax/product/:id")
    GetProductResponse get(@PathParam("id") String id);

    @GET
    @Path("/ajax/product/:id/child/:childId")
    GetProductResponse getChild(@PathParam("id") String id, @PathParam("childId") String childId);
}


package app.api;

import app.api.product.CreateProductConfigResponse;
import app.api.product.ListProductResponse;
import core.framework.api.web.service.GET;
import core.framework.api.web.service.Path;

public interface ProductAJAXWebService {
    @GET
    @Path("/ajax/product")
    ListProductResponse list();

    @GET
    @Path("/ajax/product/create-config")
    CreateProductConfigResponse createConfig();
}


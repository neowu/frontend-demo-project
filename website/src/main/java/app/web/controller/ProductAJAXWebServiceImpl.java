package app.web.controller;

import app.api.ProductAJAXWebService;
import app.api.product.CreateProductConfigResponse;
import app.api.product.ListProductResponse;
import core.framework.util.Lists;

/**
 * @author neo
 */
public class ProductAJAXWebServiceImpl implements ProductAJAXWebService {
    @Override
    public ListProductResponse list() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new Error(e);
        }
        return new ListProductResponse();
    }

    @Override
    public CreateProductConfigResponse createConfig() {
        CreateProductConfigResponse response = new CreateProductConfigResponse();
        response.types = Lists.newArrayList();
        response.types.add(type("type1", "1"));
        response.types.add(type("type2", "2"));
        return response;
    }

    private CreateProductConfigResponse.ProductType type(String name, String value) {
        CreateProductConfigResponse.ProductType type = new CreateProductConfigResponse.ProductType();
        type.name = name;
        type.value = value;
        return type;
    }
}

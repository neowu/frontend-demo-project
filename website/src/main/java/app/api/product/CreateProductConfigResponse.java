package app.api.product;

import core.framework.api.json.Property;

import java.util.List;

/**
 * @author neo
 */
public class CreateProductConfigResponse {
    @Property(name = "types")
    public List<ProductType> types;

    public static class ProductType {
        @Property(name = "name")
        public String name;
        @Property(name = "value")
        public String value;
    }
}

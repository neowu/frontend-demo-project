package app.api.product;

import core.framework.api.json.Property;
import core.framework.api.validate.NotNull;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * @author neo
 */
public class CreateProductConfigResponse {
    @Property(name = "types")
    public List<ProductType> types;

    @NotNull
    @Property(name = "now")
    public ZonedDateTime now = ZonedDateTime.now();

    public static class ProductType {
        @Property(name = "name")
        public String name;
        @Property(name = "value")
        public String value;
    }
}

package app.api.user;

import core.framework.api.json.Property;
import core.framework.api.validate.NotNull;

public class LoginAJAXResponse {
    @NotNull
    @Property(name = "success")
    public Boolean success;

    @Property(name = "name")
    public String name;

    @Property(name = "role")
    public String role;

    @Property(name = "errorMessage")
    public String errorMessage;
}

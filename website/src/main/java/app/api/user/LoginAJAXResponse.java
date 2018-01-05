package app.api.user;

import core.framework.api.json.Property;

public class LoginAJAXResponse {
    @Property(name = "success")
    public Boolean success;

    @Property(name = "name")
    public String name;

    @Property(name = "role")
    public String role;

    @Property(name = "errorMessage")
    public String errorMessage;
}

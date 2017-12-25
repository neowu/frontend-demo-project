package app.api.user;

import core.framework.api.json.Property;

public class LoginAJAXResponse {
    @Property(name = "success")
    public Boolean success;

    @Property(name = "error")
    public String error;
}

package app.api.user;

import core.framework.api.json.Property;
import core.framework.api.validate.NotNull;
import core.framework.api.validate.Size;

public class LoginAJAXRequest {
    @NotNull
    @Property(name = "username")
    public String username;

    @NotNull
    @Size(min = 3)
    @Property(name = "password")
    public String password;
}

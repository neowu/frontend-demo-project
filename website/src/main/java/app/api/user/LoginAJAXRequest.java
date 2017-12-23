package app.api.user;

import core.framework.api.json.Property;
import core.framework.api.validate.Length;
import core.framework.api.validate.NotNull;

public class LoginAJAXRequest {
    @NotNull
    @Property(name = "username")
    public String username;

    @NotNull
    @Length(min = 3)
    @Property(name = "password")
    public String password;
}

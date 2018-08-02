package app.api.user;

import core.framework.api.json.Property;
import core.framework.api.validate.NotNull;

/**
 * @author neo
 */
public class CurrentUserAJAXResponse {
    @NotNull
    @Property(name = "loggedIn")
    public Boolean loggedIn;

    @Property(name = "name")
    public String name;

    @Property(name = "role")
    public String role;
}

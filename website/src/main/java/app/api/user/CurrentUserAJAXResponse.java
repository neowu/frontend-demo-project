package app.api.user;

import core.framework.api.json.Property;

/**
 * @author neo
 */
public class CurrentUserAJAXResponse {
    @Property(name = "loggedIn")
    public Boolean loggedIn;

    @Property(name = "name")
    public String name;

    @Property(name = "role")
    public String role;
}

package app.web.session;

import core.framework.api.json.Property;

/**
 * @author neo
 */
public class LoginUser {
    @Property(name = "userId")
    public String userId;

    @Property(name = "name")
    public String name;

    @Property(name = "role")
    public String role;
}

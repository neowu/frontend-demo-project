package app.web;

import core.framework.api.json.Property;

/**
 * @author rexthk
 */
public class AJAXErrorResponse {
    @Property(name = "id")
    public String id;

    @Property(name = "errorCode")
    public String errorCode;

    @Property(name = "message")
    public String message;
}

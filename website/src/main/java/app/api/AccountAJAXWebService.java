package app.api;

import app.api.user.CurrentUserAJAXResponse;
import app.api.user.LoginAJAXRequest;
import app.api.user.LoginAJAXResponse;
import core.framework.api.web.service.GET;
import core.framework.api.web.service.PUT;
import core.framework.api.web.service.Path;

public interface AccountAJAXWebService {
    @PUT
    @Path("/ajax/login")
    LoginAJAXResponse login(LoginAJAXRequest request);

    @PUT
    @Path("/ajax/logout")
    void logout();

    @GET
    @Path("/ajax/currentUser")
    CurrentUserAJAXResponse currentUser();
}


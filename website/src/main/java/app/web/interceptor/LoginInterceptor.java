package app.web.interceptor;

import app.web.Sessions;
import core.framework.web.Interceptor;
import core.framework.web.Invocation;
import core.framework.web.Request;
import core.framework.web.Response;
import core.framework.web.WebContext;

/**
 * @author neo
 */
public class LoginInterceptor implements Interceptor {
    @Override
    public Response intercept(Invocation invocation) throws Exception {
        WebContext context = invocation.context();
        Request request = context.request();

        if (invocation.annotation(LoginRequired.class) != null) {
            Sessions.loginUser(request);
        }

        // later we may need auto login by token (aka, remember me)
        return invocation.proceed();
    }
}

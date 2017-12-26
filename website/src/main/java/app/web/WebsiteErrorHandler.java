package app.web;

import core.framework.api.http.HTTPStatus;
import core.framework.api.web.service.ResponseStatus;
import core.framework.http.ContentType;
import core.framework.http.HTTPHeaders;
import core.framework.inject.Inject;
import core.framework.log.ActionLogContext;
import core.framework.log.ErrorCode;
import core.framework.web.ErrorHandler;
import core.framework.web.Request;
import core.framework.web.Response;
import core.framework.web.site.WebDirectory;

import java.util.Optional;

/**
 * @author neo
 */
public class WebsiteErrorHandler implements ErrorHandler {
    @Inject
    WebDirectory webDirectory;

    @Override
    public Optional<Response> handle(Request request, Throwable e) {
        HTTPStatus status = httpStatus(e);

        Optional<String> accept = request.header(HTTPHeaders.ACCEPT);

        if (accept.isPresent() && accept.get().contains(ContentType.APPLICATION_JSON.mediaType())) {
            return Optional.of(Response.bean(errorResponse(e)).status(status));
        } else {
            return Optional.of(Response.file(webDirectory.path("/error.html")).contentType(ContentType.TEXT_HTML).status(status));
        }
    }

    private HTTPStatus httpStatus(Throwable e) {
        ResponseStatus responseStatus = e.getClass().getAnnotation(ResponseStatus.class);
        if (responseStatus != null) return responseStatus.value();

        return HTTPStatus.INTERNAL_SERVER_ERROR;
    }

    private AJAXErrorResponse errorResponse(Throwable e) {
        AJAXErrorResponse response = new AJAXErrorResponse();
        response.id = ActionLogContext.id();
        response.message = e.getMessage();
        if (e instanceof ErrorCode) {
            ErrorCode errorCode = (ErrorCode) e;
            response.errorCode = errorCode.errorCode();
        } else {
            response.errorCode = "INTERNAL_ERROR";
        }
        return response;
    }
}

package vn.phantruongan.backend.util;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import jakarta.servlet.http.HttpServletResponse;
import vn.phantruongan.backend.domain.RestResponse;
import vn.phantruongan.backend.util.annotation.ApiMessage;

@ControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        try {
            String uri = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                    .getRequest()
                    .getRequestURI();
            return !(uri.startsWith("/v3/api-docs") ||
                    uri.startsWith("/swagger-ui") ||
                    uri.startsWith("/swagger-resources") ||
                    uri.startsWith("/webjars"));
        } catch (Exception e) {
            return true;
        }
    }

    @Override
    @Nullable
    public Object beforeBodyWrite(@Nullable Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response) {
        HttpServletResponse httpServletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = httpServletResponse.getStatus();

        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(status);
        ApiMessage message = returnType.getMethodAnnotation(ApiMessage.class);
        // if (body instanceof String) {
        // return body;
        // }
        if (status >= 400 || body instanceof String) {
            // case error
            // res.setMessage(message != null ? message.value() + " " + "failed!" : "Call
            // api failed!");
            // res.setData(body);
            return body;
        } else {
            // case success

            res.setMessage(message != null ? message.value() + " " + "successful!" : "Call api successful!");
            res.setData(body);
        }
        // return body;
        return res;
    }

}

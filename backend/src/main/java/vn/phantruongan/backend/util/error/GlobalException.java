package vn.phantruongan.backend.util.error;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import vn.phantruongan.backend.common.RestResponse;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<RestResponse<Object>> handleResourceNotFoundException(NoResourceFoundException ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.NOT_FOUND.value());
        res.setError("Not Found");
        res.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    @ExceptionHandler({ UsernameNotFoundException.class, BadCredentialsException.class, InvalidException.class })
    public ResponseEntity<RestResponse<Object>> handleAuthAndInvalid(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        if (ex instanceof UsernameNotFoundException || ex instanceof BadCredentialsException) {
            res.setStatusCode(HttpStatus.UNAUTHORIZED.value());
            res.setError("Unauthorized");
            res.setMessage("The username or password you entered is incorrect.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
        }

        // InvalidException → Bad Request
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setError("Bad Request");
        res.setMessage(ex.getMessage() != null
                ? ex.getMessage()
                : "Invalid request. Please check your input and try again.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    // 400 Validation Error
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestResponse<Object>> validationError(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setMessage(String.join(", ", errors));
        res.setError("Validation Error");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(PermissionDeniedException.class)
    public ResponseEntity<RestResponse<Object>> handlePermissionDenied(PermissionDeniedException ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.FORBIDDEN.value());
        res.setError("Forbidden");
        res.setMessage(ex.getMessage() != null
                ? ex.getMessage()
                : "You don't have permission to perform this action.");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(res);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestResponse<Object>> handleGeneralException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        res.setError("Internal Server Error");
        res.setMessage("An unexpected error occurred. Please try again later.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }
}

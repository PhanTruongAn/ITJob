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

import vn.phantruongan.backend.domain.RestResponse;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<RestResponse<Object>> handleResourceNotFoundException(NoResourceFoundException ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.NOT_FOUND.value());
        res.setMessage("404 Not Found. No resource found!");
        res.setError(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    @ExceptionHandler({ UsernameNotFoundException.class, BadCredentialsException.class, InvalidException.class })
    public ResponseEntity<RestResponse<Object>> handleAuthAndInvalid(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        if (ex instanceof UsernameNotFoundException || ex instanceof BadCredentialsException) {
            res.setStatusCode(HttpStatus.UNAUTHORIZED.value());
            res.setMessage("The username or password you entered is incorrect.");
        } else if (ex instanceof InvalidException) {
            res.setStatusCode(HttpStatus.BAD_REQUEST.value());
            res.setMessage("Something went wrong. Please check your input and try again.");
        }
        res.setError(ex.getMessage());
        return ResponseEntity.status(res.getStatusCode()).body(res);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestResponse<Object>> validationError(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setMessage(String.join(", ", errors));
        res.setError("Validation failed");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestResponse<Object>> handleGeneralException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        res.setMessage("An internal server error occurred. Please try again later.");
        res.setError(ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }
}

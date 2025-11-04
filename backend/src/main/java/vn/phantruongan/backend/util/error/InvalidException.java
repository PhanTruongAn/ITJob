package vn.phantruongan.backend.util.error;

public class InvalidException extends RuntimeException {

    // Constructor that accepts a message
    public InvalidException(String message) {
        super(message);
    }
}

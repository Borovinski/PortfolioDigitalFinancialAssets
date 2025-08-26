package com.borovinski.exception;

public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException() {
        super("Доступ запрещен: подтвердите свою учетную запись, чтобы использовать эту функцию.");
    }
}


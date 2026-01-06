package com.verAuto.orderTracking.restController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleStatusException(ResponseStatusException ex) {
        Map<String, String> errorBody = new HashMap<>();
        // This grabs the "Username already exists" string
        errorBody.put("message", ex.getReason());

        return new ResponseEntity<>(errorBody, ex.getStatusCode());
    }
}

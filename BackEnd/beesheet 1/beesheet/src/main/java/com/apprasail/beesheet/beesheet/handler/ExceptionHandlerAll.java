package com.apprasail.beesheet.beesheet.handler;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandlerAll {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    // @ExceptionHandler(TransactionSystemException.class)
    // public ResponseEntity<Map<String, String>> handleTransactionSystemException(TransactionSystemException tse) {
    //     Throwable cause = tse.getRootCause();
    //     if (cause instanceof ConstraintViolationException constraintViolationException) {
    //         return handleConstraintViolationException(constraintViolationException);
    //     }
    //     return new ResponseEntity<>(Map.of("error", tse.getMessage()), HttpStatus.NOT_ACCEPTABLE);
    // }

    // @ExceptionHandler(ConstraintViolationException.class)
    // public ResponseEntity<Map<String, String>> handleConstraintViolationException(ConstraintViolationException ex) {
    //     Map<String, String> errors = new HashMap<>();
    //     ex.getConstraintViolations().forEach(violation -> {
    //         String fieldName = violation.getPropertyPath().toString();
    //         String errorMessage = violation.getMessage();
    //         errors.put(fieldName, errorMessage);
    //     });
    //     return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    // }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?>handleGeneralException(Exception exception)
    {
        return new ResponseEntity<>(exception.getClass().getName(),HttpStatus.I_AM_A_TEAPOT);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String>handleBadCredentialsException(BadCredentialsException exception)
    {
        return new ResponseEntity<>(exception.getMessage(),HttpStatus.UNAUTHORIZED);
    }
}

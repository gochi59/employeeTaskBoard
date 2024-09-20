package com.apprasail.beesheet.beesheet.handler;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.jsonwebtoken.ExpiredJwtException;

@RestControllerAdvice
public class ExceptionHandlerAll {

    private static final Logger log=LoggerFactory.getLogger(ExceptionHandlerAll.class);


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        log.info("Error Message: "+e.getMessage()+" Error:"+e.getClass());
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
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
        log.info("Error Message: "+ex.getMessage()+" Error:"+ex.getClass());

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?>handleGeneralException(Exception exception)
    {
        log.info("Error Message: "+exception.getMessage()+" Error:"+exception.getClass());

        return new ResponseEntity<>(exception.getClass().getName(),HttpStatus.I_AM_A_TEAPOT);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String>handleBadCredentialsException(BadCredentialsException exception)
    {
        log.info("Error Message: "+exception.getMessage()+" Error:"+exception.getClass());
        return new ResponseEntity<>(exception.getMessage(),HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<String>handleExpiredToken(ExpiredJwtException exception)
    {
        log.info("Error Message: "+exception.getMessage()+" Error:"+exception.getClass());     
        return new ResponseEntity<>(HttpStatus.GONE);
    }

    @ExceptionHandler(IllegalAccessError.class)
    public ResponseEntity<String>handleIllegalAccessException(IllegalAccessException exception)
    {
        log.info("Error Message: "+exception.getMessage()+" Error:"+exception.getClass());     
        return new ResponseEntity<String>(exception.getMessage(),HttpStatus.UNAUTHORIZED);
        
    }
}

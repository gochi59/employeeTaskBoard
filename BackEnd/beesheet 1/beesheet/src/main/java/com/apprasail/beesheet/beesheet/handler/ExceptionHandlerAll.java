package com.apprasail.beesheet.beesheet.handler;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.jsonwebtoken.ExpiredJwtException;

@RestControllerAdvice
public class ExceptionHandlerAll {

    //global exception handler for all exceptions encountered
    private static final Logger log=LoggerFactory.getLogger(ExceptionHandlerAll.class);


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        log.info("Error Message: "+e.getMessage()+" Error:"+e.getClass());
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }


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

        return new ResponseEntity<>(exception.getClass().getName(),HttpStatus.INTERNAL_SERVER_ERROR);
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
        return new ResponseEntity<>(exception.getMessage(),HttpStatus.UNAUTHORIZED);
        
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<String>handleAuthorizationDeniedException(AuthorizationDeniedException exception)
    {
        log.info(exception.getMessage(),exception.getClass());
        return new ResponseEntity<>(exception.getMessage()+" JwtToken and User url being accessed do not match",HttpStatus.UNAUTHORIZED);
    }
}

package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.SignUpService;
import com.apprasail.beesheet.beesheet.model.Entities.TemporaryUser;

@RestController
public class SignUpPageController {

    private final SignUpService signup;

    public SignUpPageController(SignUpService signup) {
        this.signup = signup;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> postMethodName(@RequestBody TemporaryUser input) {
        try {
            signup.addEmployee(input);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (IllegalArgumentException|TransactionSystemException exception) {
            throw exception;
        }
    }

}

package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.SignUpService;
import com.apprasail.beesheet.beesheet.model.Entities.TemporaryUser;



@RestController
public class SignUpPageController {

    private  final SignUpService signup;

    public SignUpPageController(SignUpService signup) {
        this.signup = signup;
    }

    @PostMapping("/signup")
    public void postMethodName(@RequestBody TemporaryUser input) {
        signup.addEmployee(input);
    }

    
    
   
    
}

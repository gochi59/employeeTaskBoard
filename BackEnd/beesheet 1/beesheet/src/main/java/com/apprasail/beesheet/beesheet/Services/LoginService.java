package com.apprasail.beesheet.beesheet.Services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.model.InputDTO.Input.LoginInput;

import jakarta.validation.Valid;

@Service
public class LoginService {

    private final JWTService jWTService;
    private final AuthenticationManager authenticationManager;
    public LoginService(AuthenticationManager authenticationManager, JWTService jWTService)
    {
        this.jWTService = jWTService;
        this.authenticationManager=authenticationManager;
    }
    public String login(@Valid LoginInput loginInput) {
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginInput.getEmail(), loginInput.getPassword()));
        if(authentication.isAuthenticated())
        {
            return jWTService.generateToken(loginInput.getEmail());
        }
        return "failure";
    }


}

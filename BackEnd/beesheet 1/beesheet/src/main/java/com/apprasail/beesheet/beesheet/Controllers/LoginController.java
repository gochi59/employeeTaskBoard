package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.LoginService;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.LoginInput;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;



@RestController

public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService)
    {
        this.loginService=loginService;
    }

    @PostMapping("/login")
    public String login(@RequestBody @Valid LoginInput loginInput,HttpServletResponse response) {
        return loginService.login(loginInput,response);
    }
    
    
}

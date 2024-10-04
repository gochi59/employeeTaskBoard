package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.RefreshTokenService;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.RefreshId;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class RefreshTokenController {

    private final RefreshTokenService refreshTokenService;

    @PostMapping("/refresh")
    public String generateRefreshToken(@CookieValue(value="userToken") String userCookie,HttpServletResponse response,@RequestBody RefreshId id) {
        return refreshTokenService.renewToken(userCookie,response,id);
        
    }

    @DeleteMapping("/cookie")
    public void  logout(@CookieValue(value="userToken")String userCookie,HttpServletResponse response) {

        refreshTokenService.logout(userCookie,response);
        
    }
    
    

}

package com.apprasail.beesheet.beesheet.Services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.RefreshToken;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.LoginInput;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class LoginService {

    //On successful login set a new cookie in browser with a newly generated refresh token AND returning an access token

    private final JWTService jWTService;
    private final AuthenticationManager authenticationManager;
    private final EmployeeRepo employeeRepo;
    private final RefreshTokenService refreshTokenService;
    public String login(@Valid LoginInput loginInput,HttpServletResponse response) {
        Employee employee=employeeRepo.findByEmail(loginInput.getEmail());
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(employee.getEmpId(), loginInput.getPassword()));
        if(authentication.isAuthenticated())
        {  
            RefreshToken refreshToken=refreshTokenService.generateRefreshToken(employee.getEmpId());
            Cookie cookie=new Cookie("userToken", refreshToken.getToken());
            cookie.setMaxAge(24*60*60);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            response.addCookie(cookie);
        
            return jWTService.generateToken(employee.getEmpId(),employee.getRole());
        }
        return "failure";
    }


}

package com.apprasail.beesheet.beesheet.Services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.LoginInput;

import jakarta.validation.Valid;

@Service
public class LoginService {

    private final JWTService jWTService;
    private final AuthenticationManager authenticationManager;
    private final EmployeeRepo employeeRepo;
    public LoginService(AuthenticationManager authenticationManager, JWTService jWTService,EmployeeRepo employeeRepo)
    {
        this.jWTService = jWTService;
        this.authenticationManager=authenticationManager;
        this.employeeRepo = employeeRepo;
    }
    public String login(@Valid LoginInput loginInput) {
        Employee employee=employeeRepo.findByEmail(loginInput.getEmail());
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(employee.getEmpId(), loginInput.getPassword()));
        if(authentication.isAuthenticated())
        {  
            return jWTService.generateToken(employee.getEmpId(),employee.getRole());
        }
        return "failure";
    }


}

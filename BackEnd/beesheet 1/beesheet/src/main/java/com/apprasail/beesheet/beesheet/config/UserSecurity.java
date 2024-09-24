package com.apprasail.beesheet.beesheet.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class UserSecurity 
{
    private final EmployeeRepo employeeRepo;

    public boolean checkUserId(Authentication authentication, String id) {
        Employee employee=employeeRepo.findById(Integer.valueOf(id)).orElseThrow(()->new IllegalArgumentException("Invalid user Id"));
        Authentication JwtAuthenticationToken = SecurityContextHolder.getContext().getAuthentication();
        String sub = JwtAuthenticationToken.getName();
        return sub.equals(String.valueOf(id));
    }
}

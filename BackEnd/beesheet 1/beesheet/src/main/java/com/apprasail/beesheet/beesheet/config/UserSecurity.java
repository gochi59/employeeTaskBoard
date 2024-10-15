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

    //used for pre authorisation to match the id in the url and id in the token for disallowing people with same level of authorisation to access each others task

    private final EmployeeRepo employeeRepo;

    public boolean checkUserId(Authentication authentication, String id) {
        Employee employee=employeeRepo.findById(Integer.valueOf(id)).orElseThrow(()->new IllegalArgumentException("Invalid user Id"));
        Authentication JwtAuthenticationToken = SecurityContextHolder.getContext().getAuthentication();
        String sub = JwtAuthenticationToken.getName();
        return sub.equals(String.valueOf(id));
    }
}

package com.apprasail.beesheet.beesheet.Services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.config.UserPrincipal;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final EmployeeRepo employeeRepo;

    public MyUserDetailsService(EmployeeRepo employeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    //Custom user detail service returning a new user principal object to be used further
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
      
        int userId;
        try {
            userId = Integer.parseInt(username);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Invalid ID format: " + username);
        }
        
        Employee employee = employeeRepo.findById(userId).orElseThrow(() -> 
            new UsernameNotFoundException("User not found with ID: " + userId)
        );
       
        return new UserPrincipal(employee);
    }
}

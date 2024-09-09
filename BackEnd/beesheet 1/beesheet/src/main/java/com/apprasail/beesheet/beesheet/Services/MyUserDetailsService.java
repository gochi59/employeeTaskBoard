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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee = employeeRepo.findByEmail(username);
        if (employee == null) {
            System.out.println("abcsd");
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return new UserPrincipal(employee);
    }

}

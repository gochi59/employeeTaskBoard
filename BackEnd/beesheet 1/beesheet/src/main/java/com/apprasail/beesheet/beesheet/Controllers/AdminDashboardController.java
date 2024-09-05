package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.AdminDashboardServices;
import com.apprasail.beesheet.beesheet.Services.SignUpService;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;


@RestController
public class AdminDashboardController {

    private final AdminDashboardServices adminDashboardServices;
    private final SignUpService signUpService;
    public AdminDashboardController(AdminDashboardServices adminDashboardServices, SignUpService signUpService) {
        this.adminDashboardServices = adminDashboardServices;
        this.signUpService = signUpService;
    }
    @GetMapping("/employees")
    public List<Employee> getMethodName() {
        return adminDashboardServices.findAll();
    }
    @GetMapping("/employee/approve/{id}")
    public void aproveEmployee(@PathVariable int id) {
        signUpService.approveUser(id);
    }

    @DeleteMapping("/employee/reject/{id}")
    public void rejectEmployee(@PathVariable int id)
    {
        signUpService.rejectEmployee(id);
    }
    
    
}

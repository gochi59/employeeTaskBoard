package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.AdminDashboardServices;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;

@RestController
public class AdminDashboardController {

    private final AdminDashboardServices adminDashboardServices;

    
    public AdminDashboardController(AdminDashboardServices adminDashboardServices) {
        this.adminDashboardServices = adminDashboardServices;
    }


    @GetMapping("/employees")
    public List<Employee> getMethodName() {
        return adminDashboardServices.findAll();
    }
}

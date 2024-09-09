package com.apprasail.beesheet.beesheet.Controllers;

import  java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Employee>> getMethodName() {
        try {
            List<Employee> employees=adminDashboardServices.findAll();
            return new ResponseEntity<>(employees,HttpStatus.OK);
        } catch (IllegalArgumentException exception) {
            throw exception;
        }
    }
   
    @GetMapping("/employee/approve/{id}")
    public ResponseEntity<Object> aproveEmployee(@PathVariable int id) {
        try {
            signUpService.approveUser(id);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (IllegalArgumentException exception) {
            throw exception;
        }
    }

    @DeleteMapping("/employee/reject/{id}")
    public ResponseEntity<?> rejectEmployee(@PathVariable int id)
    {
        try {
            signUpService.rejectEmployee(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException exception) {
            throw exception;
        }
    }

    @DeleteMapping("/employees")
    public void deleteAllEmployees()
    {
        signUpService.deleteAllEmployees();
    }
    
    
}

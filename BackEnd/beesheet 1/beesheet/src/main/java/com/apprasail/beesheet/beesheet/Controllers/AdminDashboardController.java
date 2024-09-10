package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.AdminDashboardServices;
import com.apprasail.beesheet.beesheet.Services.SignUpService;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;

@RestController
@RequestMapping("/admin")
public class AdminDashboardController {

    private final AdminDashboardServices adminDashboardServices;
    private final SignUpService signUpService;

    public AdminDashboardController(AdminDashboardServices adminDashboardServices, SignUpService signUpService) {
        this.adminDashboardServices = adminDashboardServices;
        this.signUpService = signUpService;
    }

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getMethodName() {
        List<Employee> employees = adminDashboardServices.findAll();
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/employee/approve/{id}")
    public ResponseEntity<Object> aproveEmployee(@PathVariable int id) {
        signUpService.approveUser(id);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/employee/reject/{id}")
    public ResponseEntity<?> rejectEmployee(@PathVariable int id) {
        signUpService.rejectEmployee(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/employees")
    public void deleteAllEmployees() {
        signUpService.deleteAllEmployees();
    }

}

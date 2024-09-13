package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.EmployeeDashboardService;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;

import jakarta.validation.Valid;


@RestController
public class EmployeeDashboardController {

    private final EmployeeDashboardService service;

    public EmployeeDashboardController(EmployeeDashboardService service) {
        this.service = service;
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<?> findTaskListOfEmployee(@PathVariable int id) {
        
        return new ResponseEntity<>(service.getTaskofEmployee(id),HttpStatus.ACCEPTED);
    }


    @PostMapping("/tasks/{id}")
    public ResponseEntity<Object> addTaskToEmployee(@RequestBody @Valid TaskInput input, @PathVariable int id) {
        service.addTaskToEmp(id, input);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

}

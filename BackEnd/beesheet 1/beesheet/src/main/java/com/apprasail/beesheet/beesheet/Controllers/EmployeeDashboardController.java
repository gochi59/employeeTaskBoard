package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.EmployeeDashboardService;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;




@RestController
public class EmployeeDashboardController {

    private final EmployeeDashboardService service;  

    public EmployeeDashboardController(EmployeeDashboardService service) {
        this.service = service;
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<?>findEmpListOfEmployee(@PathVariable int id) {
        try {
                service.getTaskofEmployee(id);
                return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/tasks/{id}")
    public ResponseEntity<Object> addTaskToEmployee(@RequestBody TaskInput input,@PathVariable int id) {
        try {
            service.addTaskToEmp(id,input);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } 
        catch (TransactionSystemException cve) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
        catch(IllegalArgumentException e)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
    }
    
    
}

package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.EmployeeDashboardService;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;




@RestController
public class EmployeeDashboardController {

    private final EmployeeDashboardService service;
    

    public EmployeeDashboardController(EmployeeDashboardService service) {
        this.service = service;
    }

    @GetMapping("/tasks/{id}")
    public List<Task> getMethodName(@PathVariable int id) {
        return service.getTaskofEmployee(id);
    }

    @PostMapping("/tasks/{id}")
    public void postMethodName(@RequestBody TaskInput input,@PathVariable int id) {
        service.addTaskToEmp(id,input);
    }
    
    
}

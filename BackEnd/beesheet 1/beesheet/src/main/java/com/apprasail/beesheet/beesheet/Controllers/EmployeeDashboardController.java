package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.EmployeeDashboardService;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.ProjectDTO;

import jakarta.validation.Valid;




@RestController
@PreAuthorize("@userSecurity.checkUserId(authentication, #id)")
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

    @GetMapping("/{id}/project")
    public List<ProjectDTO> getAssignedProjects(@PathVariable int id) {
        return service.getProject(id);
    }
    
    @GetMapping("/employee/{id}")
    public EmployeeDTO getEmpInfo(@PathVariable int id) {
        return service.getEmpInfo(id);
    }
    

}

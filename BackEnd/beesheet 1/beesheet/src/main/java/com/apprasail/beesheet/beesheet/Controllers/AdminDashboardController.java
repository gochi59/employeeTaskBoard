package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.AdminDashboardServices;
import com.apprasail.beesheet.beesheet.Services.SignUpService;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.EmpToProjectInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.EmployeeRatingInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.ProjectInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.ProjectDTO;

import lombok.AllArgsConstructor;


@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardServices adminDashboardServices;
    private final SignUpService signUpService;
    
    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDTO>> getMethodName() {
        List<EmployeeDTO> employees = adminDashboardServices.findAll();
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/employees/appraisal")
    public ResponseEntity<?> getAppraisableEmployees() {
        return new ResponseEntity<>(adminDashboardServices.getAppraisableEmployees(),HttpStatus.OK);
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

    @GetMapping("/project")
    public List<ProjectDTO> getAllProject() {
        return adminDashboardServices.findAllProjects();
    }

    @PostMapping("/project")
    public void addProject(@RequestBody ProjectInput projectInput) {
        adminDashboardServices.addProject(projectInput);
    }

    @PostMapping("/project/{id}")
    public void addEmpToProject(@RequestBody EmpToProjectInput input, @PathVariable int id) {
        adminDashboardServices.addEmpToProject(input, id);
    }

    @PutMapping("/task/{id}")
    public void changeTaskRating(@PathVariable int id, @RequestBody TaskInput input) {
        adminDashboardServices.changeTaskRating(id, input);
    }

    @PutMapping("/employee/attribute/{eid}")
    public void changeAttributeRating(@PathVariable int eid, @RequestBody EmployeeRatingInput input) {
        adminDashboardServices.changeAttributeRating(eid, input);
    }

    @GetMapping("/employee/attribute/{eid}")
    public List<EmployeeRatingInput> getMethodName(@PathVariable int eid) {
        return adminDashboardServices.getAttributeRating(eid);
    }

    @DeleteMapping("/employee/{id}")
    public void deleteEmployee(@PathVariable int id) {
        adminDashboardServices.deleteEmployee(id);
    }

    @PostMapping("/employee/notification/{id}")
    public void sendAppraisalNotification(@PathVariable int id) {
        adminDashboardServices.sendNotifToEmp(id);
    }
    
}

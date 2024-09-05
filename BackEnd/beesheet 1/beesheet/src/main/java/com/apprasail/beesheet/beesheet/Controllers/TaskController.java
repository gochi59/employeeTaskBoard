package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.TaskService;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;





@RestController
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping("/tasks")
    public List<Task> getAllTask() {
        return service.getAll();
    }
    
    @PostMapping("/task")
    public void addTask(@RequestBody TaskInput input) {
        service.add(input);
    }

    @PutMapping("/task/{id}")
    public void updateTask(@PathVariable int id, @RequestBody TaskInput input) {
        service.updateTask(id,input);
    }
    
    @DeleteMapping("task/{empId}/{taskId}")
    public void deleteTask(@PathVariable int empId,@PathVariable int taskId)
    {
        service.deleteTask(empId,taskId);
    }

    @GetMapping("/tasksemp/{name}")
    public List<EmployeeDTO> getTaskByNameContaining(@PathVariable String name) {
       return service.findTasksByNameContaining(name);
    }
    
}

package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
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
        try {
            service.add(input);
        } catch (TransactionSystemException e) {
            System.out.println(e);
        }
    }

    @PutMapping("/task/{empId}/{taskId}")
    public ResponseEntity<Object> updateTask(@PathVariable int empId, @PathVariable int taskId,
            @RequestBody TaskInput input) {
        try {
            service.updateTask(empId, taskId, input);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (TransactionSystemException tse) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("task/{empId}/{taskId}")
    public ResponseEntity<Object> deleteTask(@PathVariable int empId, @PathVariable int taskId) {
        try {
            service.deleteTask(empId, taskId);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/tasksemp/{name}")
    public ResponseEntity<?> getTaskByNameContaining(@PathVariable String name) {
       return service.findTasksByNameContaining(name).isEmpty()?new ResponseEntity<>(service.findTasksByNameContaining(name),HttpStatus.NOT_FOUND):new ResponseEntity<>(service.findTasksByNameContaining(name),HttpStatus.OK);
    }

}

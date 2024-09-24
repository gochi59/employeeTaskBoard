package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import jakarta.validation.Valid;

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

    @PreAuthorize("@userSecurity.checkUserId(authentication, #id)")
    @PutMapping("/task/{id}/{taskId}")
    public ResponseEntity<Object> updateTask(@PathVariable int id, @PathVariable int taskId,
            @RequestBody @Valid TaskInput input) throws IllegalAccessException {
        System.out.println(input);
        service.updateTask(id, taskId, input);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @DeleteMapping("task/{id}/{taskId}")
    public ResponseEntity<Object> deleteTask(@PathVariable int  id, @PathVariable int taskId) throws IllegalAccessException {
            service.deleteTask(id, taskId);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @GetMapping("/tasksemp/{name}")
    public ResponseEntity<?> getTaskByNameContaining(@PathVariable String name) {
        return service.findTasksByNameContaining(name).isEmpty()
                ? new ResponseEntity<>(service.findTasksByNameContaining(name), HttpStatus.NOT_FOUND)
                : new ResponseEntity<>(service.findTasksByNameContaining(name), HttpStatus.OK);
    }

}

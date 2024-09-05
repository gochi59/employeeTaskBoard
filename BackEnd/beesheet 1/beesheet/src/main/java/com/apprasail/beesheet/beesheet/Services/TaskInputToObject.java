package com.apprasail.beesheet.beesheet.Services;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;

@Service
public class TaskInputToObject {

    public Task convertToObject(TaskInput input)
    {
        Task task=new Task();
        task.setDate(input.getDate());
        task.setTitle(input.getTitle());
        task.setMarkedForAppraisal(input.isMarkedForAppraisal());
        task.setWorkLocation(input.getWorkLocation());
        task.setProject(input.getProject());
        task.setTime(input.getTime());
        task.setDescription(input.getDescription());
        task.setDate(input.getDate());
        return task;
    }
}

package com.apprasail.beesheet.beesheet.Services;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TaskInputToObject {

    //task to dto conversion
    public Task convertToObject(TaskInput input)
    {
        log.info("Dto converter called for Task");
        Task task=new Task();
        task.setDate(input.getDate());
        task.setTitle(input.getTitle());
        task.setMarkedForAppraisal(input.isMarkedForAppraisal());
        task.setWorkLocation(input.getWorkLocation());
        task.setProject(input.getProject());
        task.setTime(input.getTime());
        task.setDescription(input.getDescription());
        task.setDate(input.getDate());
        task.setTaskRating(input.getTaskRating());
        return task;
    }
}

package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskInput {
    @NotBlank(message="Task Name is invalid")
    String title;

    boolean markedForAppraisal=false;
    
    @NotBlank(message="Enter valid workLocation")
    String workLocation;
    
    @NotBlank(message="Enter valid project name")
    String project;

    @NotBlank(message="Enter valid time spent")
    String time;

    @NotBlank(message = "Enter valid description")
    String description;

    @DateTimeFormat(pattern = "yyyy-mm-dd")
    Date date;

    String taskRating;

}

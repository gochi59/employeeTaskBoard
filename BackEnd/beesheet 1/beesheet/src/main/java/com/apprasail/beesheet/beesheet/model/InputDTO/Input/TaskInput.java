package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskInput {
    @NotNull(message="Task Name is invalid")
    String title;
    boolean markedForAppraisal=false;
    @NotNull(message="Enter valid workLocation")
    String workLocation;
    @NotNull(message="Enter valid project name")
    String project;
    @NotNull(message="Enter valid time spent")
    String time;
    @NotNull(message = "Enter valid description")
    String description;
    @NotNull(message = "Invalid date")
    String date;

}

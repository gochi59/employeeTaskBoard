package com.apprasail.beesheet.beesheet.model.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
public class Task {

    @Id
    @GeneratedValue
    int taskId;
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
    String taskRating;
}

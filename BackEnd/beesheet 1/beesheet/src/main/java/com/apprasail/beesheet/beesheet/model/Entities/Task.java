package com.apprasail.beesheet.beesheet.model.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Task {

    @Id
    @GeneratedValue
    int taskId;
    String title;
    boolean markedForAppraisal;
    String workLocation;
    String project;
    String time;
    String description;
    String date;
    String taskRating;
}

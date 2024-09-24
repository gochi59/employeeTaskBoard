package com.apprasail.beesheet.beesheet.model.InputDTO.Output;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskOutput {

    int taskId;

    String title;

    boolean markedForAppraisal=false;
    
    String workLocation;
    
    String project;

    String time;

    String description;

    Date date;
    private int empId;

    String taskRating;
}

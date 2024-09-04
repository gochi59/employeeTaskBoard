package com.apprasail.beesheet.beesheet.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Task {

    @Id
    int TaskId;
    String Title;
    boolean MarkedForAppraisal;
    String WorkLocation;
    String Project;
    String Time;
    String Description;
    String Date;
}

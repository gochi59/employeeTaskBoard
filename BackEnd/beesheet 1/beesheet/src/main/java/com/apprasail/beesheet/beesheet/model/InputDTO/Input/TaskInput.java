package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import lombok.Data;

@Data
public class TaskInput {
    String Title;
    boolean MarkedForAppraisal;
    String WorkLocation;
    String Project;
    String Time;
    String Description;
    String Date;

}

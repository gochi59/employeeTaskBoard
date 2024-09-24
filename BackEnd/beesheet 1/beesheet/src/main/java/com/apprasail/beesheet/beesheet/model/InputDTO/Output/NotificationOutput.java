package com.apprasail.beesheet.beesheet.model.InputDTO.Output;

import lombok.Data;

@Data
public class NotificationOutput {

    private int id;
    private String message;
    private EmployeeDTO empDto;
    private int empId;
}

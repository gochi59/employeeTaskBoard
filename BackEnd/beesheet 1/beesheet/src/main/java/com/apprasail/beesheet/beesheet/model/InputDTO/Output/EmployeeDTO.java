package com.apprasail.beesheet.beesheet.model.InputDTO.Output;

import java.util.List;

import com.apprasail.beesheet.beesheet.model.Entities.Task;

import lombok.Data;

@Data
public class EmployeeDTO {
    private int empId;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String doj;
    private String contactNumber;
    private String role;
    private String designationTitle; 
    private List<String>projectTitles;
    private List<Task> empTask;
}

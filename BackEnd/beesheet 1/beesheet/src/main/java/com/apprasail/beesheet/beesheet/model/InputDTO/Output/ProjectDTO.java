package com.apprasail.beesheet.beesheet.model.InputDTO.Output;

import java.util.List;

import lombok.Data;

@Data
public class ProjectDTO {

    private int id;
    private String name;
    private List<EmployeeDTO>emp;
}

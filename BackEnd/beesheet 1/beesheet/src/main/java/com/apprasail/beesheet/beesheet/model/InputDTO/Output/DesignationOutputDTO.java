package com.apprasail.beesheet.beesheet.model.InputDTO.Output;

import java.util.List;

import lombok.Data;

@Data
public class DesignationOutputDTO {

    private int id;
    private String title;
    private List<String>attributes;
    private List<EmployeeDTO>employees;
}

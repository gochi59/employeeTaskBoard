package com.apprasail.beesheet.beesheet.model.InputDTO.Output;

import java.util.List;

import com.apprasail.beesheet.beesheet.model.Entities.Attributes;

import lombok.Data;

@Data
public class DesignationOutputDTO {

    private int id;
    private String title;
    private List<Attributes>attributes;
    private List<EmployeeDTO>employees;
}

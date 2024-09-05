package com.apprasail.beesheet.beesheet.model.InputDTO.Output;

import java.util.List;

import com.apprasail.beesheet.beesheet.model.Entities.Task;

import lombok.Data;

@Data
public class EmployeeByDesignationDTO {

    String name;
    List<Task>empTask;
}

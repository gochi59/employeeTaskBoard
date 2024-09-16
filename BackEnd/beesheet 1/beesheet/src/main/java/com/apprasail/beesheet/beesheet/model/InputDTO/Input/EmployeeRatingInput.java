package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import com.apprasail.beesheet.beesheet.Repository.DesignationRepo;
import com.apprasail.beesheet.beesheet.Repository.EmployeeDesignationRatingRepo;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmployeeRatingInput {

    @NotBlank(message="invalid attribute name")
    private String attribute;

    @NotBlank(message="Invalid rating")
    private String rating;

}

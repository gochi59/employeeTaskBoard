package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class DesignationInput {

    @NotBlank(message="Invalid designation name")
    String name;
    
    @NotEmpty(message="Invalid attribute list")
    List<String> attributes;
    
}

package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class DesignationInput {

    @NotNull(message = "Invalid designation name")
    String name;
    @NotNull(message="Invalid attribute list")
    List<String> attributes;
    
}

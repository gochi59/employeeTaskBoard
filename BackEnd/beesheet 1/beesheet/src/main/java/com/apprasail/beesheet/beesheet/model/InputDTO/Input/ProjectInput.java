package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectInput {

    @NotBlank(message = "Invalid project nam")
    private String name;
}

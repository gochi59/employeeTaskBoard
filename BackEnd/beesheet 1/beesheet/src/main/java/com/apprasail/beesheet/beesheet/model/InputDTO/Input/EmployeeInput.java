package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmployeeInput {

    @NotNull(message="Invalid Employee Name")
    @NotBlank(message="Invalid Employee Name")
    String firstName;
    String lastName;
    @Email(message = "Invalid email")
    String email;
    @NotNull(message="Invalid date of joining")
    @NotBlank(message="Invalid date of joining")
    String dateOfJoin;
    @NotBlank(message = "Invalid contact number")
    String contactNumber;
    @NotNull(message="Invalid designation")
    @NotBlank(message="Invalid designation")
    String designation;
    @NotNull(message="Invalid Role")
    @NotBlank(message="Invalid Role")
    String role;
    @NotNull(message = "Invalid password")
    @NotBlank(message = "Invalid password")
    String password;
}

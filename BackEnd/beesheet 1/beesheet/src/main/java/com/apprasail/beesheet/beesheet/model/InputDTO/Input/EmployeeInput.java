package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EmployeeInput {

    @NotNull(message="Invalid Employee Name")
    @NotBlank(message="Invalid Employee Name")
    String firstName;
    String lastName;
    @NotNull(message = "Invalid username")
    @NotBlank(message = "Invalid username")
    String userName;
    @Email(message = "Invalid email")
    String email;
    @NotNull(message="Invalid date of joining")
    @NotBlank(message="Invalid date of joining")
    String dateOfJoin;
    @NotNull(message = "Invalid contact number")
    @Pattern(regexp="^\\d{10}$",message="invalid mobile number")
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

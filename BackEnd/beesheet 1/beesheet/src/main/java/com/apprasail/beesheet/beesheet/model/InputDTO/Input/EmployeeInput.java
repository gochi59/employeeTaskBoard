package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EmployeeInput {

    @NotNull(message="Invalid Employee Name")
    String firstName;
    String lastName;
    @NotNull(message = "Invalid username")
    String userName;
    @NotNull(message = "Invalid email")
    @Email
    String email;
    @NotNull(message="Invalid date of joining")
    String dateOfJoin;
    @NotNull(message = "Invalid contact number")
    @Pattern(regexp="^\\d{10}$",message="invalid mobile number")
    String contactNumber;
    @NotNull(message="Invalid designation")
    String designation;
    @NotNull(message="Invalid Role")
    String role;
    @NotNull(message = "Invalid password")
    String password;
}

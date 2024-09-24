package com.apprasail.beesheet.beesheet.model.InputDTO.Input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginInput {

    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message="Invalid Password")
    private String password;
}

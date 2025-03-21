package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class TemporaryUser {

    @Id
    @GeneratedValue
    int tempId;
    
    @NotBlank(message="Invalid Employee Name")
    String firstName;
    
    String lastName;
        
    @Email(message = "Invalid email")
    String email;

    @DateTimeFormat(pattern="yyyy-mm-dd")
    Date dateOfJoin;
    
    @NotBlank(message = "Invalid contact number")
    String contactNumber;
    
    @NotBlank(message="Invalid designation")
    String designation;
    
    @NotBlank(message="Invalid Role")
    String role;
    
    @NotBlank(message = "Invalid password")
    String password;

    boolean isApproved=false;
}

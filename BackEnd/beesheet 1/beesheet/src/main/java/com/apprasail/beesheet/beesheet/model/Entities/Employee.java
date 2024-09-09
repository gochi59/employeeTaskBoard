package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.List;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Entity
@Component
public class Employee {

    @Id
    @GeneratedValue
    int empId;
    @NotNull(message = "Invalid firstname")
    @NotBlank(message="Invalid firstname")
    String firstName;

    String lastName;

    @NotNull(message="Invalid username")
    @NotBlank(message="Invalid username")
    String username;
    
    @NotNull(message = "Invalid password")
    @NotBlank(message = "Invalid password")
    String password;
    
    @Email(message="Invalid email")
    String email;
    
    @NotNull(message="Invalid date of joining")
    @NotBlank(message = "Invalid password")
    String dOJ;
    
    @ManyToOne(fetch=FetchType.LAZY)
    @JsonBackReference
    Designation designation;
    
    @NotNull(message="Invalid contact number")
    @Pattern(regexp="^\\d{10}$",message="Invalid mobile number")
    String contactNumber;
    
    @NotNull
    @NotBlank(message = "Invalid Role")
    String role;
    
    @OneToMany(cascade=CascadeType.ALL)
    List<Task>emp_Tasks;
    String attributeRating;
}

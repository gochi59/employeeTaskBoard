package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.List;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Component
public class Employee {

    @Id
    @GeneratedValue
    int empId;

    @NotBlank(message="Invalid firstname")
    String firstName;

    String lastName;
    
    @NotBlank(message = "Invalid password")
    String password;
    
    @Email(message="Invalid email")
    String email;
    
    @NotBlank(message = "Invalid password")
    String dOJ;
    
    @ManyToOne(fetch=FetchType.LAZY)
    Designation designation;
    
    @NotBlank(message="Invalid contact number")
    String contactNumber;
    
    @NotBlank(message = "Invalid Role")
    String role;
    
    @OneToMany(cascade=CascadeType.ALL)
    List<Task>emp_Tasks;
    String attributeRating;

    @ManyToMany
    private List<Project>projects;
    
}

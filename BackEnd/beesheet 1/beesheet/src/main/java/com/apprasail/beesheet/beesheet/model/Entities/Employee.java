package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Entity
public class Employee {

    @Id
    @GeneratedValue
    int empId;
    @NotNull(message = "invalid input")
    String firstName;
    String lastName;
    @NotNull(message="invalid username")
    String username;
    @NotNull(message = "invalid password")
    String password;
    @Email(message="invalid email")
    String email;
    @NotNull(message="invalid date of joining")
    String dOJ;
    @ManyToOne(fetch=FetchType.LAZY)
    @JsonBackReference
    Designation designation;
    @NotNull(message="invalid contact number")
    @Pattern(regexp="^\\d{10}$",message="invalid mobile number")
    String contactNumber;
    @NotNull
    String role;
    @OneToMany(cascade=CascadeType.ALL)
    List<Task>emp_Tasks;
    String attributeRating;
}

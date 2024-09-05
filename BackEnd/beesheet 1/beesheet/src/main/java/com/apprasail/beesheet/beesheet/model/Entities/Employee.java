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
import lombok.Data;

@Data
@Entity
public class Employee {

    @Id
    @GeneratedValue
    int empId;
    String firstName;
    String lastName;
    String username;
    String password;
    String email;
    String dOJ;
    @ManyToOne(fetch=FetchType.LAZY)
    @JsonBackReference
    Designation designation;
    String contactNumber;
    String role;
    @OneToMany(cascade=CascadeType.ALL)
    List<Task>emp_Tasks;
    String attributeRating;
}

package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Employee {

    @Id
    @GeneratedValue
    private int empId;

    @NotBlank(message = "Invalid firstname")
    private String firstName;

    private String lastName;

    @NotBlank(message = "Invalid password")
    private String password;

    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Invalid date of joining")
    private String dOJ;

    @ManyToOne(fetch = FetchType.LAZY)
    private Designation designation;

    @NotBlank(message = "Invalid contact number")
    private String contactNumber;

    @NotBlank(message = "Invalid Role")
    private String role;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Task> emp_Tasks;

    @ManyToMany
    private List<Project> projects;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "mapping_id", referencedColumnName = "id")
    private EmployeeDesignationMapping employeeDesignationMapping;

    @ElementCollection
    private List<String>notification=new ArrayList<>();

    // @ColumnDefault(value=false)
    private boolean apprasailDone=false;
}

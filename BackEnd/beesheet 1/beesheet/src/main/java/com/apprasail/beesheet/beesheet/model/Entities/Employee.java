package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.CascadeType;
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

    @DateTimeFormat(pattern="yyyy-mm-dd")
    private Date dOJ;

    @ManyToOne(fetch = FetchType.LAZY)
    private Designation designation;

    @NotBlank(message = "Invalid contact number")
    private String contactNumber;

    @NotBlank(message = "Invalid Role")
    private String role;

    @OneToMany(cascade = CascadeType.ALL,mappedBy="emp")
    private List<Task> emp_Tasks;

    @ManyToMany
    private List<Project> projects;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "mapping_id", referencedColumnName = "id")
    private EmployeeDesignationMapping employeeDesignationMapping;

    @OneToMany(mappedBy="emp",cascade=CascadeType.ALL)
    private List<Notification> notifications;

    // @ColumnDefault(value=false)
    private boolean apprasailDone=false;
}

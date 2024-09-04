package com.apprasail.beesheet.beesheet.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Employee {

    @Id
    @GeneratedValue
    int EmpId;
    String FirstName;
    String LastName;
    String Username;
    String password;
    String email;
    String DOJ;
    //Designation designation;
    String ContactNumber;
    String Role;

}

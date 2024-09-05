package com.apprasail.beesheet.beesheet.model.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class TemporaryUser {

    @Id
    @GeneratedValue
    int tempId;
    String firstName;
    String lastName;
    String userName;
    String email;
    String dateOfJoin;
    String contactNumber;
    String designation;
    String Role;
    String password;
}

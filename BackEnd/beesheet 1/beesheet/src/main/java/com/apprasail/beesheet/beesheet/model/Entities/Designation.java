package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity

public class Designation {

    @Id
    @GeneratedValue
    private int id;
    private String title;
    private List<String> attributes;
    @OneToMany(fetch = FetchType.LAZY,mappedBy="designation")
    @JsonManagedReference
    private List<Employee> empList;
}

package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
@Entity

public class Designation {

    @Id
    @GeneratedValue
    private int id;
    
    @NotBlank(message = "invalid designation name")
    private String title;

    @NotEmpty(message="invalid attributes list")
    private List<String> attributes;
    
    @OneToMany(fetch = FetchType.LAZY,mappedBy="designation")
    private List<Employee> empList;
}

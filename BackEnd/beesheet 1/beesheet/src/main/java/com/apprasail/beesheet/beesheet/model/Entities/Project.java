package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class Project {

    @Id
    @GeneratedValue
    private int id;
    
    @NotBlank(message="Invalid project name")
    private String name;
    
    @ManyToMany
    private List<Employee>emp;

}

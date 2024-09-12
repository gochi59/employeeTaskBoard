package com.apprasail.beesheet.beesheet.model.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class Project {

    @Id
    private int id;
    @NotBlank(message="Invalid project name")
    private String name;
    
    // @ManyToMany
    // private List<Employee>emp;

}

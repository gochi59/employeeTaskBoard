package com.apprasail.beesheet.beesheet.model.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Attributes {

    @Id
    @GeneratedValue
    private int id;
    
    @NotBlank
    @Column(unique=true)
    private String title;

}

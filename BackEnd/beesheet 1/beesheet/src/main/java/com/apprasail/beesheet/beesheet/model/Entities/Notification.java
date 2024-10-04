package com.apprasail.beesheet.beesheet.model.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy =GenerationType.AUTO)
    private int id;
    
    @ManyToOne
    private Employee emp;

    private int linkedId;
    private String message;
}

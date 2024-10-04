package com.apprasail.beesheet.beesheet.model.Entities;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class RefreshToken {

    @Id
    @GeneratedValue
    private int id;

    private Instant expiry;

    @ManyToOne
    private Employee emp;
    
    private String token;
}

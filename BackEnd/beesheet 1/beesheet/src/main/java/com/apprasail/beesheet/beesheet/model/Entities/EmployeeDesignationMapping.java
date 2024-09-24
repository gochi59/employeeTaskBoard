package com.apprasail.beesheet.beesheet.model.Entities;

import java.util.Map;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyJoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class EmployeeDesignationMapping {

    @Id
    @GeneratedValue
    private int id;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "employee_skill_ratings", joinColumns = @JoinColumn(name = "mapping_id"))
    @MapKeyJoinColumn(name = "attribute_id")
    @Column(name = "skill_rating")
    private Map<Attributes, String> skillRating;

    @OneToOne(mappedBy = "employeeDesignationMapping")
    private Employee employee;

}

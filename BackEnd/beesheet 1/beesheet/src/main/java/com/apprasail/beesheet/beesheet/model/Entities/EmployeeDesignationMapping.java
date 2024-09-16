package com.apprasail.beesheet.beesheet.model.Entities;

import jakarta.persistence.*;
import lombok.Data;
import java.util.HashMap;
import java.util.Map;

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

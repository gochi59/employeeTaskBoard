    package com.apprasail.beesheet.beesheet.model.Entities;

    import java.util.List;

    import jakarta.persistence.Column;
import jakarta.persistence.Entity;
    import jakarta.persistence.FetchType;
    import jakarta.persistence.GeneratedValue;
    import jakarta.persistence.Id;
    import jakarta.persistence.OneToMany;
    import jakarta.validation.constraints.NotBlank;
    import lombok.Data;

    @Data
    @Entity

    public class Designation {

        @Id
        @GeneratedValue
        private int id;
        
        @NotBlank(message = "invalid designation name")
        @Column(unique = true,nullable=false)
        private String title;

        @OneToMany
        private List<Attributes> attributes;
        
        @OneToMany(fetch = FetchType.LAZY,mappedBy="designation")
        private List<Employee> empList;
    }

package com.apprasail.beesheet.beesheet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apprasail.beesheet.beesheet.model.Entities.Designation;

@Repository
public interface DesignationRepo extends JpaRepository<Designation, Integer>{

    Designation findByTitle(String designation);

}

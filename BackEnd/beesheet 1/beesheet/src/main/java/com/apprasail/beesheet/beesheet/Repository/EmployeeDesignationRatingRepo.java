package com.apprasail.beesheet.beesheet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apprasail.beesheet.beesheet.model.Entities.EmployeeDesignationMapping;

@Repository
public interface EmployeeDesignationRatingRepo extends JpaRepository<EmployeeDesignationMapping, Integer> {

}

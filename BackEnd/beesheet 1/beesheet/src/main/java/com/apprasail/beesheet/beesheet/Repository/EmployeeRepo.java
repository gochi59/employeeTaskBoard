package com.apprasail.beesheet.beesheet.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apprasail.beesheet.beesheet.model.Entities.Employee;

@Repository
public interface  EmployeeRepo extends JpaRepository<Employee, Integer> {

    Employee findByFirstName(String name);

    List<Employee> findByFirstNameContaining(String name);

    Employee findByEmail(String email);


}

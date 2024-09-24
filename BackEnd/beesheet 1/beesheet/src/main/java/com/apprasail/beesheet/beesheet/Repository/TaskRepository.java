package com.apprasail.beesheet.beesheet.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {


    Page<Task> findAllByEmp(Employee emp, Pageable pageable);


}

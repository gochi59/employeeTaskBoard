package com.apprasail.beesheet.beesheet.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;

@Service
public class AdminDashboardServices {

    private final EmployeeRepo employeeRepo;

    public AdminDashboardServices(EmployeeRepo employeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    public List<Employee> findAll() {
        List<Employee>list=employeeRepo.findAll();
        if(list.isEmpty())
            throw new IllegalStateException();
        return list;
    }
    
}

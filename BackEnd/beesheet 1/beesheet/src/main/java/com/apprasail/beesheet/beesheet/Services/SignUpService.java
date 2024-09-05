package com.apprasail.beesheet.beesheet.Services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.DesignationRepo;
import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Designation;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.EmployeeInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;

@Service
public class SignUpService {

    private final EmployeeRepo employeeRepo;

    private final DesignationRepo designationRepo;

    public SignUpService(EmployeeRepo employeeRepo, DesignationRepo designationRepo) {
        this.employeeRepo = employeeRepo;
        this.designationRepo = designationRepo;
    }

    public void addEmployee(EmployeeInput input) {
        Employee emp=new Employee();
        emp.setFirstName(input.getFirstName());
        emp.setLastName(input.getLastName());
        emp.setDOJ(input.getDateOfJoin());
        emp.setContactNumber(input.getContactNumber());
        Designation designation=designationRepo.findByTitle(input.getDesignation());
        emp.setDesignation(designation);
        emp.setUsername(input.getUserName());
        emp.setPassword(input.getPassword());
        emp.setEmail(input.getEmail());
        emp.setRole(input.getRole());
        emp.setEmp_Tasks(Collections.<Task>emptyList());
        List<Employee> desEmpList=designation.getEmpList();
        desEmpList.add(emp);
        designation.setEmpList(desEmpList);
        designationRepo.save(designation);
        employeeRepo.save(emp);
    }

    public List<EmployeeDTO> findAll() {
         List<Employee> employees = employeeRepo.findAll();
    return employees.stream().map(emp -> {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmpId(emp.getEmpId());
        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());
        dto.setUsername(emp.getUsername());
        dto.setEmail(emp.getEmail());
        dto.setDoj(emp.getDOJ());
        dto.setContactNumber(emp.getContactNumber());
        dto.setRole(emp.getRole());
        dto.setDesignationTitle(emp.getDesignation().getTitle());
        dto.setEmpTask(emp.getEmp_Tasks());
        return dto;
    }).collect(Collectors.toList());
    }

}

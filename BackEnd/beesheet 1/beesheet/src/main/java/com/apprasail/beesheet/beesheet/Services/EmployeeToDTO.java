package com.apprasail.beesheet.beesheet.Services;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;

@Service
public class EmployeeToDTO {

    public EmployeeDTO employeeDTO(Employee emp)
    {
        EmployeeDTO employeeDTO=new EmployeeDTO();
        employeeDTO.setEmpId(emp.getEmpId());
        employeeDTO.setFirstName(emp.getFirstName());
        employeeDTO.setLastName(emp.getLastName());
        employeeDTO.setDoj(emp.getDOJ());
        employeeDTO.setContactNumber(emp.getContactNumber());
        employeeDTO.setDesignationTitle(emp.getDesignation().getTitle());
        employeeDTO.setRole(emp.getRole());
        employeeDTO.setEmail(emp.getEmail());
        employeeDTO.setEmpTask(emp.getEmp_Tasks());
        employeeDTO.setProjectTitles((emp.getProjects()).stream().map(project->project.getName()).collect(Collectors.toList()));
        return employeeDTO;
    }
}

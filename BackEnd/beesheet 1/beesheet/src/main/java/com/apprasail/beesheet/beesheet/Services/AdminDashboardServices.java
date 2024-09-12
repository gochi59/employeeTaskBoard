package com.apprasail.beesheet.beesheet.Services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.ProjectRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Project;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.ProjectInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;

@Service
public class AdminDashboardServices {

    private final EmployeeRepo employeeRepo;
    private final ProjectRepo projectRepo;
    private final EmployeeToDTO employeeToDTO;

    public AdminDashboardServices(EmployeeRepo employeeRepo,ProjectRepo projectRepo,EmployeeToDTO employeeToDTO) {
        this.employeeRepo = employeeRepo;
        this.projectRepo=projectRepo;
        this.employeeToDTO=employeeToDTO;
    }

    public List<EmployeeDTO> findAll() {
        List<Employee>list=employeeRepo.findAll();
        List<EmployeeDTO>employeeDTOList=list.stream().map(emp->employeeToDTO.employeeDTO(emp)).collect(Collectors.toList());
        return employeeDTOList;
    }

    public List<Project> findAllProjects() {
        return projectRepo.findAll();
    }

    public void addProject(ProjectInput projectInput) {
        Project project=new Project();
        project.setName(projectInput.getName());
        project.setEmp(Collections.<Employee>emptyList());
        projectRepo.save(project);
    }

    public void addEmpToProject(int projectid, int empid) {
        Project project=projectRepo.findById(projectid).orElseThrow(()->new IllegalArgumentException("Invalid Project Id"));
        Employee emp=employeeRepo.findById(empid).orElseThrow(()->new IllegalArgumentException("Invalid Employee Id"));
        List<Employee>employees=project.getEmp();
        employees.add(emp);
        project.setEmp(employees);
        projectRepo.save(project);
        List<Project>projects=emp.getProjects();
        projects.add(project);
        emp.setProjects(projects);
        employeeRepo.save(emp);
    }
    
}

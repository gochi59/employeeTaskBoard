package com.apprasail.beesheet.beesheet.Services;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.ProjectRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Project;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.ProjectInput;

@Service
public class AdminDashboardServices {

    private final EmployeeRepo employeeRepo;
    private final ProjectRepo projectRepo;

    public AdminDashboardServices(EmployeeRepo employeeRepo,ProjectRepo projectRepo) {
        this.employeeRepo = employeeRepo;
        this.projectRepo=projectRepo;
    }

    public List<Employee> findAll() {
        List<Employee>list=employeeRepo.findAll();
        if(list.isEmpty())
            throw new IllegalStateException();
        return list;
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

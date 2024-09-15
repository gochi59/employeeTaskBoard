package com.apprasail.beesheet.beesheet.Services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.ProjectRepo;
import com.apprasail.beesheet.beesheet.Repository.TaskRepository;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Project;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.ProjectInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.ProjectDTO;

@Service
public class AdminDashboardServices {

    private final EmployeeRepo employeeRepo;
    private final ProjectRepo projectRepo;
    private final EmployeeToDTO employeeToDTO;
    private final TaskRepository taskRepository;
    private final TaskInputToObject taskInputToObject;
    public AdminDashboardServices(TaskInputToObject taskInputToObject,TaskRepository taskRepository,EmployeeRepo employeeRepo,ProjectRepo projectRepo,EmployeeToDTO employeeToDTO) {
        this.employeeRepo = employeeRepo;
        this.projectRepo=projectRepo;
        this.employeeToDTO=employeeToDTO;
        this.taskRepository=taskRepository;
        this.taskInputToObject=taskInputToObject;
    }

    public List<EmployeeDTO> findAll() {
        List<Employee>list=employeeRepo.findAll();
        List<EmployeeDTO>employeeDTOList=list.stream().map(emp->employeeToDTO.employeeDTO(emp)).collect(Collectors.toList());
        return employeeDTOList;
    }

    public List<ProjectDTO> findAllProjects() {
        List<ProjectDTO>dtoList;
        List<Project>projects=projectRepo.findAll();
        dtoList=projects.stream().map(project->{
            ProjectDTO projectDTO=new ProjectDTO();
            projectDTO.setId(project.getId());
            projectDTO.setName(project.getName());
            projectDTO.setEmp(project.getEmp().stream().map(emp->employeeToDTO.employeeDTO(emp)).toList());
            return projectDTO;
        }).toList();
        return dtoList;
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
        if(employees!=null&&!employees.stream().anyMatch(empl->empl.getEmpId()==empid))
        {List<Project>projects=emp.getProjects();
        employees.add(emp);
        project.setEmp(employees);
        projectRepo.save(project);
        projects.add(project);
        emp.setProjects(projects);
        employeeRepo.save(emp);}
        else throw new IllegalArgumentException("Employee already exists in this project"); 
    }

    public void changeTaskRating(int id, TaskInput input) {
        Task task=taskRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Task Id"));
        task.setTaskRating(input.getTaskRating());
        System.out.println(input.getTaskRating());
        System.out.println(task.getTaskId()+" "+task.getTaskRating());
        taskRepository.save(task);
    }
    
}

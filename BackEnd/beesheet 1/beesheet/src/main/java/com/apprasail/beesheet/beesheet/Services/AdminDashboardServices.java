package com.apprasail.beesheet.beesheet.Services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.AttributeRepo;
import com.apprasail.beesheet.beesheet.Repository.EmployeeDesignationRatingRepo;
import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.ProjectRepo;
import com.apprasail.beesheet.beesheet.Repository.TaskRepository;
import com.apprasail.beesheet.beesheet.model.Entities.Attributes;
import com.apprasail.beesheet.beesheet.model.Entities.Designation;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.EmployeeDesignationMapping;
import com.apprasail.beesheet.beesheet.model.Entities.Project;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.EmployeeRatingInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.ProjectInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.ProjectDTO;

import aj.org.objectweb.asm.Attribute;

@Service
public class AdminDashboardServices {

    private final EmployeeRepo employeeRepo;
    private final ProjectRepo projectRepo;
    private final EmployeeToDTO employeeToDTO;
    private final TaskRepository taskRepository;
    private final AttributeRepo attributeRepo;
    private final EmployeeDesignationRatingRepo employeeDesignationRatingRepo;

    public AdminDashboardServices(EmployeeDesignationRatingRepo employeeDesignationRatingRepo,
            AttributeRepo attributeRepo, TaskInputToObject taskInputToObject, TaskRepository taskRepository,
            EmployeeRepo employeeRepo, ProjectRepo projectRepo, EmployeeToDTO employeeToDTO) {
        this.employeeRepo = employeeRepo;
        this.projectRepo = projectRepo;
        this.employeeToDTO = employeeToDTO;
        this.taskRepository = taskRepository;
        this.attributeRepo = attributeRepo;
        this.employeeDesignationRatingRepo = employeeDesignationRatingRepo;
    }

    public List<EmployeeDTO> findAll() {
        List<Employee> list = employeeRepo.findAll();
        List<EmployeeDTO> employeeDTOList = list.stream().map(emp -> employeeToDTO.employeeDTO(emp))
                .collect(Collectors.toList());
        return employeeDTOList;
    }

    public List<ProjectDTO> findAllProjects() {
        List<ProjectDTO> dtoList;
        List<Project> projects = projectRepo.findAll();
        dtoList = projects.stream().map(project -> {
            ProjectDTO projectDTO = new ProjectDTO();
            projectDTO.setId(project.getId());
            projectDTO.setName(project.getName());
            projectDTO.setEmp(project.getEmp().stream().map(emp -> employeeToDTO.employeeDTO(emp)).toList());
            return projectDTO;
        }).toList();
        return dtoList;
    }

    public void addProject(ProjectInput projectInput) {
        Project project = new Project();
        project.setName(projectInput.getName());
        project.setEmp(Collections.<Employee>emptyList());
        projectRepo.save(project);
    }

    public void addEmpToProject(int projectid, int empid) {
        Project project = projectRepo.findById(projectid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Project Id"));
        Employee emp = employeeRepo.findById(empid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee Id"));
        List<Employee> employees = project.getEmp();
        if (employees != null && !employees.stream().anyMatch(empl -> empl.getEmpId() == empid)) {
            List<Project> projects = emp.getProjects();
            employees.add(emp);
            project.setEmp(employees);
            projectRepo.save(project);
            projects.add(project);
            emp.setProjects(projects);
            employeeRepo.save(emp);
        } else
            throw new IllegalArgumentException("Employee already exists in this project");
    }

    public void changeTaskRating(int id, TaskInput input) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Task Id"));
        task.setTaskRating(input.getTaskRating());
        System.out.println(input.getTaskRating());
        System.out.println(task.getTaskId() + " " + task.getTaskRating());
        taskRepository.save(task);
    }

    public void changeAttributeRating(int id, EmployeeRatingInput input) {

        Employee employee = employeeRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee Id"));
        List<Attributes> attributes = employee.getDesignation().getAttributes();
        EmployeeDesignationMapping employeeDesignationMapping = employee.getEmployeeDesignationMapping();

        if (!attributes.stream().anyMatch(attribute -> attribute.getTitle().equals(input.getAttribute()))) {
            throw new IllegalArgumentException("Invalid Attribute Name");
        }

        Map<Attributes, String> attributeRating = employeeDesignationMapping.getSkillRating();
        Attributes attribute = attributeRepo.findByTitle(input.getAttribute());
        attributeRating.replace(attribute, input.getRating());

        employeeDesignationMapping.setSkillRating(attributeRating);
        employeeDesignationRatingRepo.save(employeeDesignationMapping);
        employee.setEmployeeDesignationMapping(employeeDesignationMapping);
        employeeRepo.save(employee);
    }

    public List<EmployeeRatingInput> getAttributeRating(int eid) {
        Employee employee = employeeRepo.findById(eid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee Id"));
        EmployeeDesignationMapping employeeDesignationMapping=employee.getEmployeeDesignationMapping();
        if(employeeDesignationMapping==null)
            throw new IllegalArgumentException("abcd");
        Map<Attributes, String> attributeRating = employee.getEmployeeDesignationMapping().getSkillRating();
        List<EmployeeRatingInput> employeeRatingInputs = new ArrayList<>();
        attributeRating.forEach(((attributes, string) -> {
            EmployeeRatingInput employeeRatingInput = new EmployeeRatingInput();
            employeeRatingInput.setAttribute(attributes.getTitle());
            employeeRatingInput.setRating(string);
            System.out.println(employeeRatingInput);
            employeeRatingInputs.add(employeeRatingInput);
        }));
        return employeeRatingInputs;
    }

    public void deleteEmployee(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteEmployee'");
    }

}

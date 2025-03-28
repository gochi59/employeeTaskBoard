package com.apprasail.beesheet.beesheet.Services;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.AttributeRepo;
import com.apprasail.beesheet.beesheet.Repository.EmployeeDesignationRatingRepo;
import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.ProjectRepo;
import com.apprasail.beesheet.beesheet.Repository.TaskRepository;
import com.apprasail.beesheet.beesheet.model.Entities.Attributes;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.EmployeeDesignationMapping;
import com.apprasail.beesheet.beesheet.model.Entities.Project;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.EmpToProjectInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.EmployeeRatingInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.ProjectInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.ProjectDTO;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class AdminDashboardServices {

    private final EmployeeRepo employeeRepo;
    private final ProjectRepo projectRepo;
    private final EmployeeToDTO employeeToDTO;
    private final TaskRepository taskRepository;
    private final AttributeRepo attributeRepo;
    private final EmployeeDesignationRatingRepo employeeDesignationRatingRepo;
    private final NotificationService notificationService;

    public List<EmployeeDTO> findAll() {
        log.info("All employee list fetched");
        List<Employee> list = employeeRepo.findAll();
        List<EmployeeDTO> employeeDTOList = list.stream().map(emp -> employeeToDTO.employeeDTO(emp))
                .collect(Collectors.toList());
        return employeeDTOList;
    }

    //all projects returned in form of dto
    public List<ProjectDTO> findAllProjects() {
        log.info("All projects list fetched");
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

    //New project creation
    public void addProject(ProjectInput projectInput) {
        log.info("New Project added " + projectInput.getName());
        Project checkProject = projectRepo.findByName(projectInput.getName());
        if (checkProject != null)
            throw new IllegalArgumentException("Project Already exists");
        Project project = new Project();
        project.setName(projectInput.getName());
        project.setEmp(Collections.<Employee>emptyList());
        projectRepo.save(project);
    }

    //adding an employee to a project
    public void addEmpToProject(EmpToProjectInput input, int empid) {
        List<Project> projects = new ArrayList<>();
        projects = (input.getProjects().stream()
                .map(x -> projectRepo.findById(x).orElseThrow(() -> new IllegalArgumentException("Invaid Project Id")))
                .toList());
        Employee emp = employeeRepo.findById(empid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee Id"));
        projects.stream().forEach((project) -> {
            List<Employee> employees = project.getEmp();
            log.info("Employee " + emp.getFirstName() + " assigned to project id " + input.getProjects());
            if (employees != null && !employees.stream().anyMatch(empl -> empl.getEmpId() == empid)) {
                List<Project> projectsEmp = emp.getProjects();
                employees.add(emp);
                project.setEmp(employees);
                projectRepo.save(project);
                projectsEmp.add(project);
                emp.setProjects(projectsEmp);
                employeeRepo.save(emp);
            } else
                throw new IllegalArgumentException("Employee already exists in this project");
        });
    }

    //rating chnages by admin
    public void changeTaskRating(int id, TaskInput input) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Task Id"));
        task.setTaskRating(input.getTaskRating());
        taskRepository.save(task);
        log.info("Rating of task of id " + id + " is being changed");
    }

    //attribute rating changes by admin
    public void changeAttributeRating(int id, EmployeeRatingInput input) {

        Employee employee = employeeRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee Id"));
        employee.setApprasailDone(true);
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
        log.info("Attribute Rating changed of employee " + employee.getFirstName());
    }

    public List<EmployeeRatingInput> getAttributeRating(int eid) {
        Employee employee = employeeRepo.findById(eid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee Id"));
        EmployeeDesignationMapping employeeDesignationMapping = employee.getEmployeeDesignationMapping();
        if (employeeDesignationMapping == null)
            throw new IllegalArgumentException("abcd");
        Map<Attributes, String> attributeRating = employee.getEmployeeDesignationMapping().getSkillRating();
        List<EmployeeRatingInput> employeeRatingInputs = new ArrayList<>();
        attributeRating.forEach(((attributes, string) -> {
            EmployeeRatingInput employeeRatingInput = new EmployeeRatingInput();
            employeeRatingInput.setAttribute(attributes.getTitle());
            employeeRatingInput.setRating(string);
            employeeRatingInputs.add(employeeRatingInput);
        }));
        log.info("Attribute Ratings accessed of " + employee.getFirstName());
        return employeeRatingInputs;
    }

    public void deleteEmployee(int id) {
        Employee employee = employeeRepo.findById(id)
                .orElseThrow((() -> new IllegalArgumentException("Invalid User id")));
        log.info(employee.getFirstName() + " is deleted");
        employeeRepo.deleteById(id);
    }

    //All employees ready for appraisal fetched
    public Object getAppraisableEmployees() {
        List<EmployeeDTO> employees = findAll();
        return employees.stream().filter(emp -> {
            return !emp.getRole().equals("ADMIN") 
            && ChronoUnit.YEARS.between(emp.getDoj().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(), LocalDate.now()) >= 1
            && emp.getEmpTask().stream().anyMatch(task -> task.isMarkedForAppraisal());
        }).toList();
    }

    public void sendNotifToEmp(int id) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Id"));
        notificationService.sendNotifToEmp(employee, "Admin has rated you");
        
    }

}

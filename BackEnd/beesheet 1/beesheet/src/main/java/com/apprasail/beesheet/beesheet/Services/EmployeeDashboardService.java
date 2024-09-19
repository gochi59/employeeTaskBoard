package com.apprasail.beesheet.beesheet.Services;

import java.time.Year;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Project;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.ProjectDTO;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EmployeeDashboardService {

    private final EmployeeRepo employeeRepo;
    private final EmployeeToDTO employeeToDTO;
    private final TaskInputToObject taskInputToObject;
    private final NotificationService notificationService;

    public List<Task> getTaskofEmployee(int id) {
        Employee emp = employeeRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid id"));
        return emp.getEmp_Tasks();
    }

    @Transactional
    public void addTaskToEmp(int id, TaskInput input) {
        Employee emp = employeeRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid id"));
        List<Task> taskList = emp.getEmp_Tasks();
        if (input.isMarkedForAppraisal()) {
            Calendar dojCalendar = Calendar.getInstance();
            dojCalendar.setTime(emp.getDOJ());
            int currentYear = Calendar.getInstance().get(Calendar.YEAR);

            if (dojCalendar.get(Calendar.YEAR) < currentYear) {
                notificationService.sendNotifToAdmin(emp.getFirstName() + " added task for approval.");
            }

        }
        taskList.add(taskInputToObject.convertToObject(input));
        emp.setEmp_Tasks(taskList);
        employeeRepo.save(emp);
    }

    public List<ProjectDTO> getProject(int id) {
        Employee employee = employeeRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Id"));

        List<Project> projectsCopy = new ArrayList<>(employee.getProjects());

        return projectsCopy.stream()
                .map(project -> {
                    ProjectDTO projectDTO = new ProjectDTO();
                    projectDTO.setEmp(project.getEmp().stream()
                            .map(emp -> employeeToDTO.employeeDTO(emp))
                            .collect(Collectors.toList()));
                    projectDTO.setId(project.getId());
                    projectDTO.setName(project.getName());
                    return projectDTO;
                })
                .collect(Collectors.toList());
    }

    public EmployeeDTO getEmpInfo(int id) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Id"));
        return employeeToDTO.employeeDTO(employee);
    }

}

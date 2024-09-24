package com.apprasail.beesheet.beesheet.Services;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.TaskRepository;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Project;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.ProjectDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.TaskOutput;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class EmployeeDashboardService {

    private final EmployeeRepo employeeRepo;
    private final EmployeeToDTO employeeToDTO;
    private final TaskInputToObject taskInputToObject;
    private final NotificationService notificationService;
    private final TaskRepository taskRepository;

    public Page<TaskOutput> getTaskofEmployee(int id,int pageSize,int pageNumber) {
        Employee emp = employeeRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid id"));
        
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Task> tasks = taskRepository.findAllByEmp(emp, pageable);
        
        return tasks.map(task -> {
            TaskOutput output = new TaskOutput();
            output.setTaskId(task.getTaskId());
            output.setDate(task.getDate());
            output.setDescription(task.getDescription());
            output.setEmpId(task.getEmp().getEmpId());
            output.setTime(task.getTime());
            output.setTitle(task.getTitle());
            output.setProject(task.getProject());
            output.setMarkedForAppraisal(task.isMarkedForAppraisal());
            output.setWorkLocation(task.getWorkLocation());
            output.setTaskRating(task.getTaskRating());
            return output;
        });
    }

    public void addTaskToEmp(int id, TaskInput input) {
        Employee emp = employeeRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid id"));
        List<Task> taskList = emp.getEmp_Tasks();
        if (input.isMarkedForAppraisal()) {
            emp.setApprasailDone(false);
            Calendar dojCalendar = Calendar.getInstance();
            dojCalendar.setTime(emp.getDOJ());
            int currentYear = Calendar.getInstance().get(Calendar.YEAR);

            if (dojCalendar.get(Calendar.YEAR) < currentYear) {
                notificationService.sendNotifToAdmin(emp.getEmpId(), emp.getFirstName() + " added task for approval.");
            }

        }
        Task task = taskInputToObject.convertToObject(input);
        task.setEmp(emp);
        taskList.add(task);
        emp.setEmp_Tasks(taskList);
        employeeRepo.save(emp);
        log.info("New task added to employee: " + emp.getFirstName());
    }

    public List<ProjectDTO> getProject(int id) {
        Employee employee = employeeRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Id"));

        List<Project> projectsCopy = new ArrayList<>(employee.getProjects());
        log.info("Project being fetched with id: " + id);
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
        Employee employee = employeeRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee Id"));
        log.info("Employee info being fetched of id: " + id);
        return employeeToDTO.employeeDTO(employee);
    }

}

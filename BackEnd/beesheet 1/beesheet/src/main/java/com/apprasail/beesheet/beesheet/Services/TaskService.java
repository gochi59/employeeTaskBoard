package com.apprasail.beesheet.beesheet.Services;

import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

import javax.management.Notification;

import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.TaskRepository;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TaskService {

    private final TaskRepository taskRepo;
    private final EmployeeRepo employeeRepo;
    private final TaskInputToObject taskInputToObject;
    private final NotificationService notificationService;

    public List<Task> getAll() {
        return taskRepo.findAll();
    }

    public void add(TaskInput input) {
        try {
            taskRepo.save(taskInputToObject.convertToObject(input));
        } catch (TransactionSystemException e) {
            throw e;
        }
    }

    public void deleteTask(int empId, int taskId) {
        Employee employee = employeeRepo.findById(empId).orElseThrow(()->new IllegalArgumentException("Invalid id"));
        List<Task> empTasks = employee.getEmp_Tasks();
        boolean exists = false;
        for (Task empTask : empTasks) {
            if (empTask.getTaskId() == taskId) {
                empTasks.remove(empTask);
                exists = true;
                break;
            }
        }
        if (!exists)
            throw new IllegalArgumentException();
        try {
            employee.setEmp_Tasks(empTasks);
            employeeRepo.save(employee);
            taskRepo.deleteById(taskId);
        } catch (Exception e) {
            throw e;
        }
    }

    @Transactional
    public void updateTask(int empId, int taskId, TaskInput input) {
        Employee employee = employeeRepo.findById(empId).orElseThrow(()->new IllegalArgumentException("Invalid id"));
        if(input.isMarkedForAppraisal())
        {
            Calendar dojCalendar = Calendar.getInstance();
            dojCalendar.setTime(employee.getDOJ());
            int currentYear = Calendar.getInstance().get(Calendar.YEAR);

            if (dojCalendar.get(Calendar.YEAR) < currentYear) {
                notificationService.sendNotifToAdmin(employee.getFirstName() + " added task for approval.");
            }
            employee.setApprasailDone(false);
        }
        boolean check = employee.getEmp_Tasks().stream().anyMatch(t -> t.getTaskId() == taskId);
        if (check) {
            Task task = taskRepo.findById(taskId).orElseThrow(() -> new IllegalArgumentException("Invalid Task Id"));
            task.setTitle(input.getTitle());
            task.setMarkedForAppraisal(input.isMarkedForAppraisal());
            task.setWorkLocation(input.getWorkLocation());
            task.setProject(input.getProject());
            task.setTime(input.getTime());
            task.setDescription(input.getDescription());
            task.setDate(input.getDate());
            taskRepo.save(task);
        } else {
            throw new IllegalArgumentException("Task not found in this Employee's Task List");
        }

    }

    public List<EmployeeDTO> findTasksByNameContaining(String name) {

        List<Employee> empList = employeeRepo.findByFirstNameContaining(name);
        return empList.stream().map(emp -> {
            EmployeeDTO dto = new EmployeeDTO();
            dto.setEmpId(emp.getEmpId());
            dto.setFirstName(emp.getFirstName());
            dto.setLastName(emp.getLastName());
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

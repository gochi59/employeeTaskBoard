package com.apprasail.beesheet.beesheet.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.TaskRepository;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;

@Service
public class TaskService {

    private final TaskRepository taskRepo;
    private final EmployeeRepo employeeRepo;
    private final TaskInputToObject taskInputToObject;

    

    public TaskService(TaskRepository taskRepo, EmployeeRepo employeeRepo, TaskInputToObject taskInputToObject) {
        this.taskRepo = taskRepo;
        this.employeeRepo = employeeRepo;
        this.taskInputToObject = taskInputToObject;
    }

    public List<Task> getAll() {
        return taskRepo.findAll();
    }

    public void add(TaskInput input) {
        taskRepo.save(taskInputToObject.convertToObject(input));
    }

    public void deleteTask(int empId, int taskId) {
        Employee employee = employeeRepo.findById(empId).orElse(null);
        if (employee != null) {
            List<Task> empTasks = employee.getEmp_Tasks();
            for (Task empTask : empTasks) {
                if (empTask.getTaskId() == taskId) {
                    empTasks.remove(empTask);
                    break;
                }
            }
            employee.setEmp_Tasks(empTasks);
            employeeRepo.save(employee);
            taskRepo.deleteById(taskId);
        }
    }

    public void updateTask(int id, TaskInput input) {
        Task task = taskRepo.findById(id).orElse(null);
        if (task != null) {
            if (!input.getTitle().isEmpty()) {
                task.setTitle(input.getTitle());
            }
            task.setMarkedForAppraisal(input.isMarkedForAppraisal());
            if (!input.getWorkLocation().isEmpty()) {
                task.setWorkLocation(input.getWorkLocation());
            }
            if (!input.getProject().isEmpty()) {
                task.setProject(input.getProject());
            }
            if (!input.getTime().isEmpty()) {
                task.setTime(input.getTime());
            }
            if (!input.getDescription().isEmpty()) {
                task.setDescription(input.getDescription());
            }
            if (!input.getDate().isEmpty()) {
                task.setDate(input.getDate());
            }
            taskRepo.save(task);
        }

    }

    public List<EmployeeDTO> findTasksByNameContaining(String name) {
        
        List<Employee> empList=employeeRepo.findByFirstNameContaining(name);
        return empList.stream().map(emp->{
            EmployeeDTO dto=new EmployeeDTO();
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

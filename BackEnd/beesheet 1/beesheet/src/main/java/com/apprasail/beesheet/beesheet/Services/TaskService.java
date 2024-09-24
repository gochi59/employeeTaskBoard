package com.apprasail.beesheet.beesheet.Services;

import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.TaskRepository;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.TaskOutput;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class TaskService {

    private final TaskRepository taskRepo;
    private final EmployeeRepo employeeRepo;
    private final TaskInputToObject taskInputToObject;
    private final NotificationService notificationService;

    public List<Task> getAll() {
        return taskRepo.findAll();
    }

    public void add(TaskInput input) {
            taskRepo.save(taskInputToObject.convertToObject(input));
            log.info("new task added");
    }

    public void deleteTask(int empId, int taskId) throws IllegalAccessException {

        Employee employee = employeeRepo.findById(empId).orElseThrow(() -> new IllegalArgumentException("Invalid id"));
        List<Task> empTasks = employee.getEmp_Tasks();
        boolean anyTaskMarkedForAppraisal=false;
        boolean exists = false;
        log.info("Task deleted for "+employee.getFirstName()+" with task id: "+taskId);
        for (Task empTask : empTasks) {
            if (empTask.getTaskId() == taskId) {
                if (empTask.getTaskRating() != null) {
                    throw new IllegalAccessException("Cannot delete rated tasks");
                }
                empTasks.remove(empTask);
                exists = true;
                break;
            }
            else if(empTask.getTaskRating()==null)
            {
                anyTaskMarkedForAppraisal|=empTask.isMarkedForAppraisal();
            }
        }
        if (!exists)
        {   throw new IllegalArgumentException();}
        employee.setEmp_Tasks(empTasks);
        if(!anyTaskMarkedForAppraisal)
        {
            employee.setApprasailDone(true);
        }
        employeeRepo.save(employee);
        taskRepo.deleteById(taskId);
    }

    public void updateTask(int empId, int taskId, TaskInput input) throws IllegalAccessException {
        log.info(taskId+" task being updated for "+empId);
        Employee employee = employeeRepo.findById(empId).orElseThrow(() -> new IllegalArgumentException("Invalid id"));
        boolean check = employee.getEmp_Tasks().stream().anyMatch(t -> t.getTaskId() == taskId);
        if (check) {
            Task task = taskRepo.findById(taskId).orElseThrow(() -> new IllegalArgumentException("Invalid Task Id"));
            if (task.getTaskRating() != null) {
                throw new IllegalAccessException("Cannot edit rated tasks");
            }
            task.setTitle(input.getTitle());
            task.setMarkedForAppraisal(input.isMarkedForAppraisal());
            task.setWorkLocation(input.getWorkLocation());
            task.setProject(input.getProject());
            task.setTime(input.getTime());
            task.setDescription(input.getDescription());
            task.setDate(input.getDate());
            taskRepo.save(task);
            if (input.isMarkedForAppraisal()) {
                Calendar dojCalendar = Calendar.getInstance();
                dojCalendar.setTime(employee.getDOJ());
                int currentYear = Calendar.getInstance().get(Calendar.YEAR);
    
                if (dojCalendar.get(Calendar.YEAR) < currentYear) {
                    notificationService.sendNotifToAdmin(employee.getEmpId(),employee.getFirstName() + " added task for approval.");
                }
                employee.setApprasailDone(false);
            }
        } else {
            throw new IllegalArgumentException("Task not found in this Employee's Task List");
        }
        

    }

    public List<EmployeeDTO> findTasksByNameContaining(String name) {
        log.info("find task by name containing called");
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
            dto.setEmpTask(emp.getEmp_Tasks().stream().map(task->{
                TaskOutput output=new TaskOutput();
            output.setTaskId(task.getTaskId());
            output.setDate(task.getDate());
            output.setDescription(task.getDescription());
            output.setEmpId(task.getEmp().getEmpId());
            output.setTime(task.getTime());
            output.setTitle(task.getTitle());
            output.setProject(task.getProject());
            output.setMarkedForAppraisal(task.isMarkedForAppraisal());
            output.setTaskRating(task.getTaskRating());
            return output;
            }).toList());
            return dto;
        }).collect(Collectors.toList());
    }

}

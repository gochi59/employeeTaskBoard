package com.apprasail.beesheet.beesheet.Services;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.TaskInput;

@Service
public class EmployeeDashboardService {

    private final EmployeeRepo employeeRepo;

    private final TaskInputToObject taskInputToObject;

    public EmployeeDashboardService(EmployeeRepo employeeRepo, TaskInputToObject taskInputToObject) {
        this.employeeRepo = employeeRepo;
        this.taskInputToObject = taskInputToObject;
    }

    public List<Task> getTaskofEmployee(int id) {
       Employee emp=employeeRepo.findById(id).orElse(null);
       if(emp!=null)
       {
        return emp.getEmp_Tasks();
       }
       return Collections.<Task>emptyList();
    }

    public void addTaskToEmp(int id, TaskInput input) {
        Employee emp=employeeRepo.findById(id).orElse(null);
        if(emp!=null)
        {
            List<Task>taskList=emp.getEmp_Tasks();

            taskList.add(taskInputToObject.convertToObject(input));
            emp.setEmp_Tasks(taskList);
            employeeRepo.save(emp);
        }
        //errorImplementationForWrongId
    }

}

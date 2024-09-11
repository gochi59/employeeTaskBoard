package com.apprasail.beesheet.beesheet.Services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

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

    public List<Task> getTaskofEmployee(String id) {
        Employee emp = employeeRepo.findByEmail(id);
        return emp.getEmp_Tasks();
    }

    public void addTaskToEmp(int id, TaskInput input) {
        Employee emp = employeeRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Employee Id"));
        try {
            List<Task> taskList = emp.getEmp_Tasks();
            taskList.add(taskInputToObject.convertToObject(input));
            emp.setEmp_Tasks(taskList);
            employeeRepo.save(emp);
        } catch (TransactionSystemException | IllegalArgumentException tse) {
            throw tse;
        }
    }

}

package com.apprasail.beesheet.beesheet.Services;

import java.util.List;

import javax.management.Notification;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.NotificationInput;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NotificationServices {

    private final EmployeeRepo employeeRepo;

    public List<String> getNotif(int id) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Id"));
        return employee.getNotification();
    }

    public void addNotif(int id,NotificationInput input) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Id"));
        List<String>notifications=employee.getNotification();
        notifications.add(input.getData());
        employee.setNotification(notifications);
        employeeRepo.save(employee);
    }

}

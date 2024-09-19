package com.apprasail.beesheet.beesheet.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NotificationService {

    private final EmployeeRepo employeeRepo;

    public void sendNotifToAdmin(String message)
    {
        List<Employee>admins=employeeRepo.findByRole("ADMIN");
        admins.stream().forEach(adm->{
            List<String>notifications=adm.getNotification();
            notifications.add(message);
            adm.setNotification(notifications);
            employeeRepo.save(adm);
        });
    }

    public void sendNotifToEmp(Employee emp,String message)
    {
        List<String>notifications=emp.getNotification();
        notifications.add(message);
        emp.setNotification(notifications);
        employeeRepo.save(emp);

    }

    public void deleteAll(int id) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Argument"));
        employee.setNotification(new ArrayList<>());
        employeeRepo.save(employee);
    }

    public List<String> getNotif(int id) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Argument"));
        return employee.getNotification();
    }
}

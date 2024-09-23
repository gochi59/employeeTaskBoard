package com.apprasail.beesheet.beesheet.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
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
        log.info("Notifcation sent to all admins");
    }

    public void sendNotifToEmp(Employee emp,String message)
    {
        List<String>notifications=emp.getNotification();
        notifications.add(message);
        emp.setNotification(notifications);
        employeeRepo.save(emp);
        log.info("Notif sent to "+emp.getFirstName());

    }

    public void deleteAll(int id) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Argument"));
        employee.setNotification(new ArrayList<>());
        employeeRepo.save(employee);
        log.info("All notifications deleted of "+employee.getFirstName());
    }

    public List<String> getNotif(int id) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Argument"));
        log.info("Notification list being fetched for "+employee.getFirstName());
        return employee.getNotification();
    }
}

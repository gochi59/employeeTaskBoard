package com.apprasail.beesheet.beesheet.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.NotificationRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Notification;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.NotificationOutput;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class NotificationService {

    private final EmployeeRepo employeeRepo;
    private final EmployeeToDTO employeeToDTO;
    private final NotificationRepo notificationRepo;

    public void sendNotifToAdmin(int id, String message)
    {
        List<Employee>admins=employeeRepo.findByRole("ADMIN");
        admins.stream().forEach(adm->{
            List<Notification>notifications=adm.getNotifications();
            Notification notification=new Notification();
            notification.setEmp(adm);
            notification.setMessage(message);
            notification.setLinkedId(id);
            notifications.add(notification);
            adm.setNotifications(notifications);
            employeeRepo.save(adm);
        });
        log.info("Notifcation sent to all admins");
    }

    public void sendNotifToEmp(Employee emp,String message)
    {
        List<Notification>notifications=emp.getNotifications();
        Notification notification=new Notification();
        notification.setMessage(message);
        notification.setEmp(emp);
        notifications.add(notification);
        emp.setNotifications(notifications);
        employeeRepo.save(emp);
        log.info("Notif sent to "+emp.getFirstName());

    }

    public void deleteAll(int id) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Argument"));
        List<Notification>notifications=new ArrayList<>(employee.getNotifications());
        employee.getNotifications().clear();
        employeeRepo.save(employee);
        notifications.stream().forEach(notif->notificationRepo.deleteById(notif.getId()));
        log.info("All notifications deleted of "+employee.getFirstName());
    }

    public List<NotificationOutput> getNotif(int id) {
        Employee employee=employeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Employee Argument"));
        log.info("Notification list being fetched for "+employee.getFirstName());
        List<Notification> notifications = new ArrayList<>(employee.getNotifications());
    
        List<NotificationOutput>notificationOutputs=notifications.stream().map(notification->{
            NotificationOutput output=new NotificationOutput();
            output.setId(notification.getId());
            output.setEmpId(notification.getLinkedId());
            output.setMessage(notification.getMessage());
            output.setEmpDto(employeeToDTO.employeeDTO(notification.getEmp()));
            return output;
        }).toList();
        // System.out.println(notificationOutputs);
        return notificationOutputs;
    }

    public void deleteById(int id) {
        log.info("notification being deleted:"+id);
        Notification notification=notificationRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Invalid Notification Id"));
        Employee employee=notification.getEmp();
        List<Notification>notifications=new ArrayList<>(employee.getNotifications());
        System.out.println(notifications.size());
        notifications=notifications.stream().filter((notif)->notif.getId()!=id).collect(Collectors.toList());
        System.out.println(notifications.size());
        employee.setNotifications(notifications);
        employeeRepo.save(employee);
        notificationRepo.deleteById(id); 
    }
}

package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

import com.apprasail.beesheet.beesheet.Services.NotificationService;


@RestController
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationServices;

    @GetMapping("/notification/{id}")
    public List<String> getNotifs(@PathVariable int id) {
       return notificationServices.getNotif(id);
    }
 
    @DeleteMapping("/notification/{id}")
    public void deleteAllNotifs(@PathVariable int id)
    {
        notificationServices.deleteAll(id);
    }
    
}

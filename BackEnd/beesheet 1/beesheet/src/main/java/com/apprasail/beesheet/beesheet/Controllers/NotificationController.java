package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import com.apprasail.beesheet.beesheet.Services.NotificationServices;
import com.sun.nio.sctp.Notification;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.apprasail.beesheet.beesheet.model.InputDTO.Input.NotificationInput;


@RestController
@AllArgsConstructor
public class NotificationController {

    private final NotificationServices notificationServices;

    @GetMapping("/notification/{id}")
    public List<String> getMethodName(@PathVariable int id) {
       return notificationServices.getNotif(id);
    }
 
    @PostMapping("/notification/{id}")
    public void  postMethodName(@PathVariable int id,@RequestBody NotificationInput input) {
        notificationServices.addNotif(id,input);
    }
    
}

package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.NotificationService;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.NotificationOutput;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
// @PreAuthorize("@userSecurity.checkUserId(authentication, #id)")
public class NotificationController {

    private final NotificationService notificationServices;

    @GetMapping("/notification/{id}")
    public List<NotificationOutput> getNotifs(@PathVariable int id) {
        return notificationServices.getNotif(id);
    }

    @DeleteMapping("/notifications/{id}")
    public void deleteAllNotifs(@PathVariable int id) {
        notificationServices.deleteAll(id);
    }

    @DeleteMapping("/notification/{id}")
    public void deleteNotificationById(@PathVariable int id)
    {
        notificationServices.deleteById(id);
    }
}

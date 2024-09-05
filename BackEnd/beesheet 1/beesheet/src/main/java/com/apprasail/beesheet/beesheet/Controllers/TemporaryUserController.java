package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.apprasail.beesheet.beesheet.Services.TemporaryUserService;
import com.apprasail.beesheet.beesheet.model.Entities.TemporaryUser;


@RestController
public class TemporaryUserController {

    private final TemporaryUserService temporaryUserService;

    public TemporaryUserController(TemporaryUserService temporaryUserService) {
        this.temporaryUserService = temporaryUserService;
    }
    
    @GetMapping("/tempusers")
    public List<TemporaryUser> getTempUser() {
       return temporaryUserService.findAll();
    }
    
    
}

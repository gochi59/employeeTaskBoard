package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
public class EmployeeDesignationRatingController {

    @PutMapping("/employee/attribute/{eid}")
    public String changeAttributeRating(@PathVariable int id, @RequestBody String entity) {
        //TODO: process PUT request
        
        return entity;
    }
}

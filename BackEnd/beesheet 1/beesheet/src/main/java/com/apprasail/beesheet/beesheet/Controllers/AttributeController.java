package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.stereotype.Controller;

import com.apprasail.beesheet.beesheet.Services.AttributeService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import com.apprasail.beesheet.beesheet.model.Entities.Attributes;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.AttributeInput;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class AttributeController {

    private final AttributeService attributeService;

    public AttributeController(AttributeService attributeService) {
        this.attributeService = attributeService;
    }
    
    @GetMapping("/attributes")
    public List<Attributes> getAllAttributes() {
        return attributeService.getAll();
    }
    

    @PostMapping("/attribute")
    public void  addAttribute(@RequestBody Attributes attributeInput) {
        attributeService.addAttribute(attributeInput);
    }
    
}

package com.apprasail.beesheet.beesheet.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.apprasail.beesheet.beesheet.Services.DesignationService;
import com.apprasail.beesheet.beesheet.model.Entities.Designation;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.DesignationInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.DesignationOutputDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeByDesignationDTO;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
public class DesignationController {

    
    private final DesignationService designationService;


    public DesignationController(DesignationService designationService) {
        this.designationService = designationService;
    }

    @PostMapping("/designation")
    public void postMethodName(@RequestBody @Valid DesignationInput input) {
            designationService.addDesignation(input); 
    }

    @GetMapping("/alldes")
    public List<DesignationOutputDTO> getMethodName() {
        return designationService.findAll();
    }
    
    @GetMapping("/designation/{name}")
    public List<EmployeeByDesignationDTO> getMethodName(@PathVariable String name) {
       return designationService.findemp(name);
    }
    
    @PutMapping("/designation/{dId}/{aId}")
    public void  addAttribute(@PathVariable int dId,@PathVariable int aId) {
        designationService.addAttribute(dId,aId);
    }
    
}

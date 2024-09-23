package com.apprasail.beesheet.beesheet.Services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.AttributeRepo;
import com.apprasail.beesheet.beesheet.Repository.DesignationRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Attributes;
import com.apprasail.beesheet.beesheet.model.Entities.Designation;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.DesignationInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.DesignationOutputDTO;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeByDesignationDTO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DesignationService {

    private final DesignationRepo designationRepo;
    private final EmployeeToDTO employeeToDTO;
    private final AttributeRepo attributeRepo;

    public DesignationService(AttributeRepo attributeRepo,DesignationRepo designationRepo,EmployeeToDTO  employeeToDTO) {
        this.designationRepo = designationRepo;
        this.employeeToDTO=employeeToDTO;
        this.attributeRepo=attributeRepo;
    }

    public void addDesignation(DesignationInput input) {
        Designation designation=designationRepo.findByTitle(input.getName());
        if(designation!=null)
            throw new IllegalArgumentException("This designation already exists.");
        Designation des=new Designation();
        // des.setAttributes(input.getAttributes());
        des.setTitle(input.getName());
        des.setEmpList(Collections.<Employee>emptyList());
        designationRepo.save(des);
        log.info("New designation added "+input.getName());
    }

    public List<DesignationOutputDTO> findAll() {
        List<DesignationOutputDTO>designationOutputDTOs=designationRepo.findAll().stream().map(des->{
            DesignationOutputDTO designationOutputDTO=new DesignationOutputDTO();
            designationOutputDTO.setId(des.getId());
            designationOutputDTO.setAttributes(des.getAttributes());
            designationOutputDTO.setTitle(des.getTitle());
            designationOutputDTO.setEmployees((des.getEmpList().stream()).map(emp->employeeToDTO.employeeDTO(emp)).toList());
            return designationOutputDTO;
        }).toList();
        log.info("All designation list fetched");
        return designationOutputDTOs;
    }

  
    public List<EmployeeByDesignationDTO> findemp(String name) {
        Designation designation=designationRepo.findByTitle(name);
        List<Employee>empList=designation.getEmpList();
        List<EmployeeByDesignationDTO>allEmpByDesig=empList.stream()
                      .map(emp->{
                        EmployeeByDesignationDTO dto=new EmployeeByDesignationDTO();
                        dto.setName(emp.getFirstName()+" "+emp.getLastName());
                        dto.setEmpTask(emp.getEmp_Tasks());
                        return dto;
                      }).collect(Collectors.toList());
        log.info("All employees being fetched of designation: "+name);
        return allEmpByDesig;
    }

    public void addAttribute(int dId, int aId) {
        Designation designation=designationRepo.findById(dId).orElseThrow(()->new IllegalArgumentException("Invalid Designation Id"));
        List<Attributes>attributes=designation.getAttributes();
        Attributes attribute=attributeRepo.findById(aId).orElseThrow(()->new IllegalArgumentException("Invalid Attribute Id"));
        attributes.add(attribute);
        designation.setAttributes(attributes);
        designationRepo.save(designation);
        log.info("Attribute "+aId+" added to desination "+dId);
    }
    

}

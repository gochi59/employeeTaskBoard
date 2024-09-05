package com.apprasail.beesheet.beesheet.Services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.DesignationRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Designation;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.DesignationInput;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeByDesignationDTO;

@Service
public class DesignationService {

    private final DesignationRepo designationRepo;

    public DesignationService(DesignationRepo designationRepo) {
        this.designationRepo = designationRepo;
    }

    public void addDesignation(DesignationInput input) {
        Designation des=new Designation();
        des.setAttributes(input.getAttributes());
        des.setTitle(input.getName());
        des.setEmpList(Collections.<Employee>emptyList());
        designationRepo.save(des);
    }

    public List<Designation> findAll() {
        return designationRepo.findAll();
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
        return allEmpByDesig;
    }
    

}

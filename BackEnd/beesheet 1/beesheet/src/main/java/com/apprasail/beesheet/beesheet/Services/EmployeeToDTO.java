package com.apprasail.beesheet.beesheet.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.EmployeeDesignationRatingRepo;
import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Attributes;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.EmployeeDesignationMapping;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmployeeToDTO {

    private final EmployeeDesignationRatingRepo employeeDesignationRatingRepo;
    private final EmployeeRepo employeeRepo;

    public EmployeeToDTO(EmployeeRepo employeeRepo,EmployeeDesignationRatingRepo employeeDesignationRatingRepo) {
        this.employeeDesignationRatingRepo = employeeDesignationRatingRepo;
        this.employeeRepo=employeeRepo;
    }

    public EmployeeDTO employeeDTO(Employee emp) {
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setEmpId(emp.getEmpId());
        employeeDTO.setFirstName(emp.getFirstName());
        employeeDTO.setLastName(emp.getLastName());
        employeeDTO.setDoj(emp.getDOJ());
        employeeDTO.setContactNumber(emp.getContactNumber());
        employeeDTO.setDesignationTitle(emp.getDesignation().getTitle());
        employeeDTO.setRole(emp.getRole());
        employeeDTO.setEmail(emp.getEmail());
        employeeDTO.setEmpTask(emp.getEmp_Tasks());
        if (emp.getEmployeeDesignationMapping() == null||emp.getEmployeeDesignationMapping().getSkillRating().isEmpty()) {
            EmployeeDesignationMapping employeeDesignationMapping = new EmployeeDesignationMapping();
            employeeDesignationMapping.setEmployee(emp);
            Map<Attributes, String> mp = new HashMap<>();
            emp.getDesignation().getAttributes().stream().forEach(attribute -> {
                mp.put(attribute, "0");
            });
            employeeDesignationMapping.setSkillRating(mp);
            employeeDesignationRatingRepo.save(employeeDesignationMapping);
            emp.setEmployeeDesignationMapping(employeeDesignationMapping);
            employeeDTO.setAttributeRating(mp);
        } else {
            employeeDTO.setAttributeRating(emp.getEmployeeDesignationMapping().getSkillRating());
        }
        employeeDTO.setProjectTitles(
                (emp.getProjects()).stream().map(project -> project.getName()).collect(Collectors.toList()));
        if(emp.getNotification()==null)
            emp.setNotification(new ArrayList<>());
        employeeRepo.save(emp);
        employeeDTO.setNotifications(emp.getNotification());
        employeeDTO.setApprasailDone(emp.isApprasailDone());
        employeeDTO.setNotifications(emp.getNotification());
        log.info("Object to dto for employee called");
        return employeeDTO;
    }
}

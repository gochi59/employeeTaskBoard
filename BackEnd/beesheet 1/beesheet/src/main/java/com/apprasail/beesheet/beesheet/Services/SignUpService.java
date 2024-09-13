package com.apprasail.beesheet.beesheet.Services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.DesignationRepo;
import com.apprasail.beesheet.beesheet.Repository.EmployeeRepo;
import com.apprasail.beesheet.beesheet.Repository.TemporaryUserRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Designation;
import com.apprasail.beesheet.beesheet.model.Entities.Employee;
import com.apprasail.beesheet.beesheet.model.Entities.Project;
import com.apprasail.beesheet.beesheet.model.Entities.Task;
import com.apprasail.beesheet.beesheet.model.Entities.TemporaryUser;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.EmployeeDTO;

@Service
public class SignUpService {

    private final EmployeeRepo employeeRepo;
    private final TemporaryUserRepo temporaryUserRepo;
    private final DesignationRepo designationRepo;
    private final EmailService emailService;
    private final BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

    public SignUpService(EmployeeRepo employeeRepo, DesignationRepo designationRepo,
            TemporaryUserRepo temporaryUserRepo, EmailService emailService) {
        this.employeeRepo = employeeRepo;
        this.temporaryUserRepo = temporaryUserRepo;
        this.designationRepo = designationRepo;
        this.emailService = emailService;
    }

    public void addEmployee(TemporaryUser input) {
        String inputEmail = input.getEmail();
        List<Employee> employees = employeeRepo.findAll();
        List<TemporaryUser> temps = temporaryUserRepo.findAll();
        boolean alreadyExists = employees.stream().anyMatch(emp -> emp.getEmail().equals(inputEmail))
                || temps.stream().anyMatch(temp -> temp.getEmail().equals(inputEmail));
        if (alreadyExists) {
            throw new IllegalArgumentException("Email already Exists");
        }
        input.setPassword(encoder.encode(input.getPassword()));
        temporaryUserRepo.save(input);
    }

    public List<EmployeeDTO> findAll() {
        List<Employee> employees = employeeRepo.findAll();
        return employees.stream().map(emp -> {
            EmployeeDTO dto = new EmployeeDTO();
            dto.setEmpId(emp.getEmpId());
            dto.setFirstName(emp.getFirstName());
            dto.setLastName(emp.getLastName());
            // dto.setUsername(emp.getUsername());
            dto.setEmail(emp.getEmail());
            dto.setDoj(emp.getDOJ());
            dto.setContactNumber(emp.getContactNumber());
            dto.setRole(emp.getRole());
            dto.setDesignationTitle(emp.getDesignation().getTitle());
            dto.setEmpTask(emp.getEmp_Tasks());
            return dto;
        }).collect(Collectors.toList());
    }

    public void approveUser(int id) {
        TemporaryUser input = temporaryUserRepo.findById(id).orElseThrow(() -> new IllegalArgumentException());
        Employee emp = new Employee();
        emp.setFirstName(input.getFirstName());
        emp.setLastName(input.getLastName());
        emp.setDOJ(input.getDateOfJoin());
        emp.setContactNumber(input.getContactNumber());
        Designation designation = designationRepo.findByTitle(input.getDesignation());
        emp.setDesignation(designation);
        emp.setPassword(input.getPassword());
        emp.setEmail(input.getEmail());
        emp.setRole(input.getRole());
        emp.setProjects(Collections.<Project>emptyList());
        emp.setEmp_Tasks(Collections.<Task>emptyList());
        List<Employee> desEmpList = designation.getEmpList();
        desEmpList.add(emp);
        designation.setEmpList(desEmpList);
        designationRepo.save(designation);
        employeeRepo.save(emp);
        temporaryUserRepo.deleteById(id);
        emailService.sendNewMail(input.getEmail(), "Signup Status",
                "Your request to sign up to beesheets has been approved");

    }

    public void rejectEmployee(int id) {
        TemporaryUser user = temporaryUserRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid User ID"));
        emailService.sendNewMail(user.getEmail(), "Signup Status",
                "Your request to sign up to beesheets has been rejected");
        temporaryUserRepo.deleteById(id);
    }

    public void deleteAllEmployees() {
        employeeRepo.deleteAll();
    }

}

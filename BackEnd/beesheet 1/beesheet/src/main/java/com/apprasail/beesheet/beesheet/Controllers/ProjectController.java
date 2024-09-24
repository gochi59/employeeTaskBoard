package com.apprasail.beesheet.beesheet.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.apprasail.beesheet.beesheet.Services.AdminDashboardServices;
import com.apprasail.beesheet.beesheet.model.InputDTO.Output.ProjectDTO;

@RestController
public class ProjectController {

    private final AdminDashboardServices adminDashboardServices;
    public ProjectController (AdminDashboardServices adminDashboardServices)
    {
        this.adminDashboardServices=adminDashboardServices;
    }
    @GetMapping("/project")
    public List<ProjectDTO> getAllProject() {
        return adminDashboardServices.findAllProjects();
    }
}

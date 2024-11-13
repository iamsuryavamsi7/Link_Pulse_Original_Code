package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(
        name = "accenture_projects"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccentureProjects {

    @Id
    @GeneratedValue
    private Long id;

    private String projectName;

    @NotBlank
    private String projectDescription;

    @NotNull
    private Date projectCreatedOn;

    @NotNull
    private boolean projectCompleted;

    // Project - multiple projects for one project manager
    @ManyToOne
    @JoinColumn(
            name = "project_manager_id"
    )
    @JsonBackReference("multipleProjectsForOneProjectManager")
    private AccentureUserEntity projectManager;

    // Project - one project for multiple team leads
    @OneToMany(
            mappedBy = "teamLeadProject",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference("projectCanHaveMultipleTeamLeads")
    private List<AccentureUserEntity> teamLead = new ArrayList<>();

    // Project - one project for multiple team members
    @OneToMany(
            mappedBy = "teamMemberProject",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference("projectCanHaveMultipleTeamMembers")
    private List<AccentureUserEntity> teamMembers = new ArrayList<>();

}

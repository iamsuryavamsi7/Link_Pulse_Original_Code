package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Role.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(
        name = "accenture_users",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "userEmail"
                }
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccentureUserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String profilePicUrl;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String userEmail;

    @NotBlank
    private String userPassword;

    @NotNull
    private boolean userUnlocked;

    private String designation;

    private Date registeredDate;

    @NotBlank
    private String subDomain;

    @OneToMany(
            mappedBy = "accentureUser",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference
    private List<AccentureToken> accentureToken = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    // Project Manager - one project manager for multiple projects
    @OneToMany(
            mappedBy = "projectManager"
    )
    @JsonManagedReference("multipleProjectsForOneProjectManager")
    private List<AccentureProjects> projectManagerProjects;

    // Team Lead - multiple team leads for one project
    @ManyToOne
    @JoinColumn(
            name = "team_lead_project_id"
    )
    @JsonBackReference("projectCanHaveMultipleTeamLeads")
    private AccentureProjects teamLeadProject;

    // Team Member - multiple team members for one project
    @ManyToOne
    @JoinColumn(
            name = "team_member_project_id"
    )
    @JsonBackReference("projectCanHaveMultipleTeamMembers")
    private AccentureProjects teamMemberProject;

    // Relationships to manage roles

    // Project Manager - can have multiple teamLeads
    @OneToMany(
            mappedBy = "projectManager",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference("projectManagerRef")
    private List<AccentureUserEntity> teamLeads;

    // Team Lead - can have one project manager
    @ManyToOne
    @JoinColumn(
            name = "project_manager_id"
    )
    @JsonBackReference("projectManagerRef")
    private AccentureUserEntity projectManager;

    // Team Lead - can have multiple team members
    @OneToMany(
            mappedBy = "teamLead",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference("teamLeadRef")
    private List<AccentureUserEntity> teamMembers;

    // Team Member - will have one team lead
    @ManyToOne
    @JoinColumn(
            name = "team_lead_id"
    )
    @JsonBackReference("teamLeadRef")
    private AccentureUserEntity teamLead;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return userPassword;
    }

    @Override
    public String getUsername() {
        return userEmail;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}

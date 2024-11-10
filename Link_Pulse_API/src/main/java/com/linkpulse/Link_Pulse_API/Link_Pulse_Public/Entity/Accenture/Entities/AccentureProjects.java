package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities;

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

    // One Project to many projectManagers
    @OneToMany(
            mappedBy = "accentureProject",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    @JsonManagedReference
    private List<AccentureUserEntity> projectManagers = new ArrayList<>();

}

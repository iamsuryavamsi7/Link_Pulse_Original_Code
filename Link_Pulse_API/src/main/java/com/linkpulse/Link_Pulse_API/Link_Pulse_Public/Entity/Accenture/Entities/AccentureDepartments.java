package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(
        name = "accenture_departments_table",
        uniqueConstraints = @UniqueConstraint(columnNames = {
                "departmentName"
        })
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccentureDepartments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String departmentName;
    private Date departmentCreatedOn;

    // Department - single department for multiple designations
    @OneToMany(
            mappedBy = "department",
            cascade = CascadeType.ALL
    )
    @JsonManagedReference
    private List<AccentureDesignations> designations;

}

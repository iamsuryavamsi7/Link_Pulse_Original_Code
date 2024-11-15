package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(
        name = "accenture_designations_table",
        uniqueConstraints = @UniqueConstraint(columnNames = {
                "designationName"
        })
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccentureDesignations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String designationName;
    private Date designationCreatedOn;

}

package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "accenture_locations_table",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "accentureLocation"
                }
        )
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccentureLocations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String accentureLocation;

}

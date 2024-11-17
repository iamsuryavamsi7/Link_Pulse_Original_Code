package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(
        name = "accenture_locations_table",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "locationAddress"
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

    @NotBlank
    private String locationAddress;

    @NotNull
    private Date locationCreatedOn;

}

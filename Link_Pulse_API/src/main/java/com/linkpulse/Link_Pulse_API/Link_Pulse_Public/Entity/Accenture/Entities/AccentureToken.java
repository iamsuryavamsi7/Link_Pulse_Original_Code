package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Role.TokenType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "accenture_token_table"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccentureToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(
            length = 1024
    )
    private String token;

    @Enumerated(EnumType.STRING)
    private TokenType tokenType;

    @NotNull
    private boolean expired;

    @NotNull
    private boolean revoked;

    @ManyToOne
    @JoinColumn(
            name = "accenture_user_id"
    )
    @JsonBackReference
    private AccentureUserEntity accentureUser;

}

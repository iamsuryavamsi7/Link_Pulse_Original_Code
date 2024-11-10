package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Model.Accenture;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationRequestModel {

    @NotBlank
    @Email
    private String userEmail;

    @NotBlank
    private String userPassword;

    @NotBlank
    private String subDomain;

}

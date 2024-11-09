package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponseModel {

    @JsonProperty("access_token")
    private String accessToken;

}

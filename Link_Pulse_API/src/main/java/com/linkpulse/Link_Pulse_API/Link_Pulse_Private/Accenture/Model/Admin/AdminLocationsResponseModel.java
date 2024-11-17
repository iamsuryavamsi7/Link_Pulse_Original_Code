package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLocationsResponseModel {

    private Long id;
    private String locationAddress;
    private Date locationCreatedOn;

}

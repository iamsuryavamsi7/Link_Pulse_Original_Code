package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Role.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProfileModel {

    private Long id;
    private String profilePicUrl;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String designation;
    private String department;
    private String about;
    private String whatILoveAboutMyJob;
    private Role role;
    private Long employeeNumber;
    private String companyLocation;

}

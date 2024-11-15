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
public class AdminNavBarUserObjectModel {

    private Long id;
    private String profilePicUrl;
    private String userName;
    private String designation;
    private Role role;

}

package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureDepartments;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDesignationWithListOfDepartmentsResponseModel {

    private Long id;
    private String designationName;
    private Date designationCreatedOn;
    private Long departmentId;
    private String departmentName;
    private List<AccentureDepartments> departments;

}

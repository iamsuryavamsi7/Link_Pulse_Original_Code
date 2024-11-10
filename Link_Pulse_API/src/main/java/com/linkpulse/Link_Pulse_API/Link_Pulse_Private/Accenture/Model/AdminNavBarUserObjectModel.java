package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminNavBarUserObjectModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String profilePicUrl;
    private String userName;
    private String designation;

    @Override
    public String toString() {
        return "AdminNavBarUserObjectModel{" +
                "id=" + id +
                ", profilePicUrl='" + profilePicUrl + '\'' +
                ", userName='" + userName + '\'' +
                ", designation='" + designation + '\'' +
                '}';
    }

}

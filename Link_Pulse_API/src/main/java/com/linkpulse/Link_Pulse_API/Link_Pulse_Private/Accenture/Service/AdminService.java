package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Service;

import com.fasterxml.jackson.databind.util.BeanUtil;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.AdminNavBarUserObjectModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureUserRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AccentureUserRepo accentureUserRepo;

    private final JwtService jwtService;

    public AdminNavBarUserObjectModel fetchUserObject(HttpServletRequest request) {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        System.out.println(userEmail);

        return accentureUserRepo.findByUserEmail(userEmail)
                .map(userObject -> {

                    AdminNavBarUserObjectModel mainUserObject = new AdminNavBarUserObjectModel();

                    System.out.println(mainUserObject.toString());

                    BeanUtils.copyProperties(userObject, mainUserObject);

                    mainUserObject.setUserName(userObject.getFirstName() + " " + userObject.getLastName());

                    return mainUserObject;

                })
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found" + userEmail));

    }

}

package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Controller;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.AdminNavBarUserObjectModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/fetchUserObject")
    public ResponseEntity<AdminNavBarUserObjectModel> fetchUserObject(
            HttpServletRequest request
    ){

        System.out.println("Hitted...");

        AdminNavBarUserObjectModel fetchedUserObject = adminService.fetchUserObject(request);

        return ResponseEntity.ok(fetchedUserObject);

    }

    @GetMapping("/greet")
    public String greet(){

        return "Hi";

    }

}

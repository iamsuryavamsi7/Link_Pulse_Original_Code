package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Controller.Admin;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.AddProjectAdminRequestModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.AdminNavBarUserObjectModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.FetchedProjectsDataResponseModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Service.Admin.AdminService;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureUserEntity;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureUserRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    private final JwtService jwtService;

    private final AccentureUserRepo accentureUserRepo;

    @GetMapping("/fetchUserObject")
    public ResponseEntity<AdminNavBarUserObjectModel> fetchUserObject(
            HttpServletRequest request
    ){

        AdminNavBarUserObjectModel fetchedUserObject = adminService.fetchUserObject(request);

        return ResponseEntity.ok(fetchedUserObject);

    }

    @GetMapping("/downloadUserProfilePictureByName")
    public ResponseEntity<byte[]> downloadUserProfilePictureByName(
            HttpServletRequest request
    ){

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        AccentureUserEntity fetchedUser = accentureUserRepo.findByUserEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        if ( fetchedUser.getProfilePicUrl() == null || fetchedUser.getProfilePicUrl().isEmpty() ){

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Profile Picture Not Available".getBytes());

        }

        byte[] fetchedImage = adminService.downloadUserProfilePictureByName(fetchedUser);

        String fileName = fetchedUser.getProfilePicUrl() != null ? fetchedUser.getProfilePicUrl() : "No Profile Picture Found";

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .contentLength(fetchedImage.length)
                .body(fetchedImage);

    }

    @GetMapping("/fetchProjectsData/{pageNumber}/{pageSize}")
    public ResponseEntity<List<FetchedProjectsDataResponseModel>> fetchProjectsDataPagination(
            @PathVariable("pageNumber") int pageNumber,
            @PathVariable("pageSize") int pageSize
    ){

        List<FetchedProjectsDataResponseModel> fetchedProjectsData = adminService.fetchProjectsDataPagination(pageNumber, pageSize);

        return ResponseEntity.ok(fetchedProjectsData);

    }

    @PostMapping("/addProject")
    public ResponseEntity<String> addProject(
            @Valid @RequestBody AddProjectAdminRequestModel addProjectAdminRequestModel
    ){

        String message = adminService.addProject(addProjectAdminRequestModel);

        return ResponseEntity.ok(message);

    }

}

package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Controller.Admin;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Error.AccentureProjectNotFoundException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Helper.MediaTypeResolver;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.*;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Service.Admin.AdminService;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureUserEntity;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureUserRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/accenture-admin")
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

        MediaType mediaType = MediaTypeResolver.resolveMediaType(fileName); // Use the helper method

        return ResponseEntity.ok()
                .contentType(mediaType)
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

    @DeleteMapping("/deleteProjectById/{projectId}")
    public ResponseEntity<String> deleteProjectById(
            @PathVariable("projectId") Long id
    ){

        String successMessage = adminService.deleteProjectById(id);

        return ResponseEntity.ok(successMessage);

    }

    @GetMapping("/getProjectById/{projectId}")
    public ResponseEntity<GetProjectByIdModelResponse> getProjectById(
            @PathVariable("projectId") Long projectId
    ) throws AccentureProjectNotFoundException {

        GetProjectByIdModelResponse fetchedProjectDetails = adminService.getProjectById(projectId);

        return ResponseEntity.ok(fetchedProjectDetails);

    }

    @PutMapping("/updateProject/{projectId}")
    public ResponseEntity<String> updateProjectById(
            @PathVariable("projectId") Long projectId,
            @Valid @RequestBody UpdateProjectByIdRequestModel requestModel
    ) throws AccentureProjectNotFoundException {

        String successMessage = adminService.updateProjectById(projectId, requestModel);

        return ResponseEntity.ok(successMessage);

    }

    @GetMapping("/fetch-locked-users/{pageNumber}/{pageSize}")
    public ResponseEntity<List<LockedUsersResponseModel>> fetchLockedUsers(
            @PathVariable("pageNumber") int pageNumber,
            @PathVariable("pageSize") int pageSize
    ){

        List<LockedUsersResponseModel> fetchedLockedUsers = adminService.fetchLockedUsers(pageNumber, pageSize);

        return ResponseEntity.ok(fetchedLockedUsers);

    }

    @GetMapping("/fetch-all-projects")
    public ResponseEntity<List<FetchAllProjectsResponseModel>> fetchAllProjects(){

        List<FetchAllProjectsResponseModel> fetchedProjects = adminService.fetchAllProjects();

        return ResponseEntity.ok(fetchedProjects);

    }

    @PostMapping("/acceptEmployeeById/{userId}")
    public ResponseEntity<String> acceptEmployeeById(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody AcceptEmployeeByIdRequestModel requestModel
    ) throws AccentureProjectNotFoundException {

        String successMessage = adminService.acceptEmployeeById(userId, requestModel);

        return ResponseEntity.ok(successMessage);

    }

    @DeleteMapping("/deleteEmployeeById/{userId}")
    public ResponseEntity<String> deleteEmployeeById(
            @PathVariable("userId") Long userId
    ){

        String successMessage = adminService.deleteEmployeeById(userId);

        return ResponseEntity.ok(successMessage);

    }

    @GetMapping("/checkIfProjectManagerIsAlreadyAssigned/{projectId}")
    public ResponseEntity<Boolean> checkIfProjectManagerIsAlreadyAssigned(
            @PathVariable("projectId") Long projectId
    ) throws AccentureProjectNotFoundException {

        Boolean booleanValue = adminService.checkIfProjectManagerIsAlreadyAssigned(projectId);

        return ResponseEntity.ok(booleanValue);

    }

    @PostMapping("/updateProfileData")
    public ResponseEntity<String> updateProfileData(
            @RequestParam(value = "updateImageSrc", required = false) MultipartFile updateImageSrc,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("about") String about,
            @RequestParam("whatILoveAboutMyJob") String whatILoveAboutMyJob,
            HttpServletRequest request
    ) throws IOException {

        String successMessage = adminService.updateProfileData(updateImageSrc, firstName, lastName, about, whatILoveAboutMyJob, request);

        return ResponseEntity.ok(successMessage);

    }

}

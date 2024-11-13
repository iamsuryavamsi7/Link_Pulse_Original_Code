package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Service.Admin;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Error.AccentureProjectNotFoundException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.*;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureProjects;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureUserEntity;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Role.Role;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureProjectsRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureUserRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final JwtService jwtService;

    private final AccentureUserRepo accentureUserRepo;

    private final AccentureProjectsRepo accentureProjectsRepo;

    @Value("${cloud.aws.keys.accenture.bucket-name}")
    private String bucketName;

    private final S3Client s3;

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

    public byte[] downloadUserProfilePictureByName(
            AccentureUserEntity accentureUser
    ) {

        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(accentureUser.getProfilePicUrl())
                .build();

        // Get the object from S3
        ResponseInputStream<GetObjectResponse> objectInputStream = s3.getObject(objectRequest);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[1024]; // Buffer for reading the stream
            int bytesRead;

            // Read the input stream and write to output stream
            while ((bytesRead = objectInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            // Convert output stream to byte array
            return outputStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            return new byte[0]; // or handle exception as needed

        }

    }

    public List<FetchedProjectsDataResponseModel> fetchProjectsDataPagination(int pageNumber, int pageSize) {

        List<FetchedProjectsDataResponseModel> fetchedProjects = accentureProjectsRepo.findAll()
                .stream()
                .sorted(Comparator.comparing(AccentureProjects::getProjectCreatedOn).reversed())
                .map(project -> {

                    FetchedProjectsDataResponseModel project1 = new FetchedProjectsDataResponseModel();

                    BeanUtils.copyProperties(project, project1);

                    return project1;

                })
                .toList();

        int start = pageNumber * pageSize;
        int end = Math.min(start + pageSize, fetchedProjects.size());

        System.out.println("Page Number :- " + pageNumber + " and Page Size :- " + pageSize);

        // If start index is beyond the size of the list, return an empty list
        if (start >= fetchedProjects.size()) {
            return new ArrayList<>(); // Return an empty list if no data for the requested page
        }

        return fetchedProjects.subList(start, end);

    }

    public String addProject(AddProjectAdminRequestModel addProjectAdminRequestModel) {

        AccentureProjects project = new AccentureProjects();

        project.setProjectName(addProjectAdminRequestModel.getProjectName());
        project.setProjectDescription(addProjectAdminRequestModel.getProjectDescription());
        project.setProjectCompleted(false);
        project.setProjectCreatedOn(new Date(System.currentTimeMillis()));

        accentureProjectsRepo.save(project);

        return "Project Saved";

    }

    public String deleteProjectById(Long id) {

        accentureProjectsRepo.deleteById(id);

        return "Project Deleted";

    }

    public GetProjectByIdModelResponse getProjectById(Long projectId) throws AccentureProjectNotFoundException {

        return accentureProjectsRepo.findById(projectId)
                .map(project -> {

                    GetProjectByIdModelResponse project1 = new GetProjectByIdModelResponse();

                    BeanUtils.copyProperties(project, project1);

                    return project1;

                })
                .orElseThrow(
                        () -> new AccentureProjectNotFoundException("Accenture Project Not Found")
                );

    }

    public String updateProjectById(Long projectId, UpdateProjectByIdRequestModel requestModel) throws AccentureProjectNotFoundException {

        Optional<AccentureProjects> fetchedAccentureProject = accentureProjectsRepo.findById(projectId);

        if ( fetchedAccentureProject.isPresent() ){

            AccentureProjects accentureProject = fetchedAccentureProject.get();

            BeanUtils.copyProperties(requestModel, accentureProject);

            accentureProjectsRepo.save(accentureProject);

            return "Project Updated";

        }

        throw new AccentureProjectNotFoundException("Accenture Project Not Found");

    }

    public List<LockedUsersResponseModel> fetchLockedUsers(int pageNumber, int pageSize) {

        List<LockedUsersResponseModel> fetchedUsers = accentureUserRepo.findAll()
                .stream()
                .filter(accentureUser -> !accentureUser.isUserUnlocked())
                .sorted(Comparator.comparing(AccentureUserEntity::getRegisteredDate).reversed())
                .map(accentureUser1 -> {

                    LockedUsersResponseModel accentureUser2 = new LockedUsersResponseModel();

                    accentureUser2.setId(accentureUser1.getId());
                    accentureUser2.setFullName(accentureUser1.getFirstName() + " " + accentureUser1.getLastName());
                    accentureUser2.setEmail(accentureUser1.getUserEmail());

                    return accentureUser2;

                })
                .toList();


        int start = pageNumber * pageSize;
        int end = Math.min(start + pageSize, fetchedUsers.size());

        System.out.println("Page Number :- " + pageNumber + " and Page Size :- " + pageSize);

        // If start index is beyond the size of the list, return an empty list
        if (start >= fetchedUsers.size()) {
            return new ArrayList<>(); // Return an empty list if no data for the requested page
        }

        return fetchedUsers.subList(start, end);

    }

    public List<FetchAllProjectsResponseModel> fetchAllProjects() {

        return accentureProjectsRepo.findAll()
                .stream()
                .filter(accentureProjects -> !accentureProjects.isProjectCompleted() )
                .sorted(Comparator.comparing(AccentureProjects::getProjectCreatedOn).reversed())
                .map(project -> {

                    FetchAllProjectsResponseModel projectsResponseModel = new FetchAllProjectsResponseModel();

                    BeanUtils.copyProperties(project, projectsResponseModel);

                    return projectsResponseModel;

                })
                .toList();

    }

    public String acceptEmployeeById(Long userId, AcceptEmployeeByIdRequestModel requestModel) throws AccentureProjectNotFoundException {

        AccentureUserEntity fetchedAccentureUser = accentureUserRepo.findById(userId).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        AccentureProjects fetchedAccentureProject = accentureProjectsRepo.findById(requestModel.getProjectId()).orElseThrow(
                () -> new AccentureProjectNotFoundException("Accenture Project Now Found")
        );

        fetchedAccentureUser.setRole(requestModel.getRole());
        fetchedAccentureUser.setDesignation(requestModel.getDesignation());

        if ( requestModel.getRole().equals(Role.PROJECTMANAGER) ){

            fetchedAccentureUser.setProjectManagerProject(fetchedAccentureProject);

        } else if ( requestModel.getRole().equals(Role.TEAMLEAD) ){

            fetchedAccentureUser.setTeamLeadProject(fetchedAccentureProject);

        }else if ( requestModel.getRole().equals(Role.TEAMMEMBER)){

            fetchedAccentureUser.setTeamMemberProject(fetchedAccentureProject);

        }

        fetchedAccentureUser.setUserUnlocked(true);

        accentureUserRepo.save(fetchedAccentureUser);

        return "User Updated";

    }

}

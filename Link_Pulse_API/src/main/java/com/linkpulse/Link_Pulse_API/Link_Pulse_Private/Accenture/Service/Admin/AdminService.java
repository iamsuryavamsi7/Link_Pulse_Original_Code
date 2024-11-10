package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Service.Admin;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.AddProjectAdminRequestModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.AdminNavBarUserObjectModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.FetchedProjectsDataResponseModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureProjects;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureUserEntity;
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

}

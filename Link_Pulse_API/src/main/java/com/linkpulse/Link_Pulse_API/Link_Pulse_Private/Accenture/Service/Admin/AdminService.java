package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Service.Admin;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Error.AccentureDepartmentNotFoundException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Error.AccentureDesignationNotFoundException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.AdminProfileModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Error.AccentureProjectNotFoundException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Model.Admin.*;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureDepartments;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureDesignations;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureProjects;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureUserEntity;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Role.Role;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureDepartmentsRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureDesignationsRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureProjectsRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureUserRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final JwtService jwtService;

    private final AccentureUserRepo accentureUserRepo;

    private final AccentureProjectsRepo accentureProjectsRepo;

    private final AccentureDepartmentsRepo accentureDepartmentsRepo;

    private final AccentureDesignationsRepo accentureDesignationsRepo;

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

            fetchedAccentureUser.getProjectManagerProjects().add(fetchedAccentureProject);

            fetchedAccentureProject.setProjectManager(fetchedAccentureUser);

        } else if ( requestModel.getRole().equals(Role.TEAMLEAD) ){

            fetchedAccentureUser.setTeamLeadProject(fetchedAccentureProject);

            fetchedAccentureProject.getTeamLead().add(fetchedAccentureUser);

        }else if ( requestModel.getRole().equals(Role.TEAMMEMBER)){

            fetchedAccentureUser.setTeamMemberProject(fetchedAccentureProject);

            fetchedAccentureProject.getTeamMembers().add(fetchedAccentureUser);

        }

        fetchedAccentureUser.setUserUnlocked(true);

        accentureUserRepo.save(fetchedAccentureUser);

        accentureProjectsRepo.save(fetchedAccentureProject);

        return "User Updated";

    }

    public String deleteEmployeeById(Long userId) {

        accentureUserRepo.deleteById(userId);

        return "User Deleted";

    }

    public Boolean checkIfProjectManagerIsAlreadyAssigned(Long projectId) throws AccentureProjectNotFoundException {

        AccentureProjects fetchedProject = accentureProjectsRepo.findById(projectId).orElseThrow(
                () -> new AccentureProjectNotFoundException("Accenture Project Not Found")
        );

        return fetchedProject.getProjectManager() != null;

    }

    public String updateProfileData(MultipartFile updateImageSrc, String firstName, String lastName, String about, String whatILoveAboutMyJob, HttpServletRequest request) throws IOException {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        AccentureUserEntity accentureUser = accentureUserRepo.findByUserEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        String originalFileName = updateImageSrc.getOriginalFilename();

        if ( originalFileName != null){

            originalFileName = originalFileName.replace(" ", "_");

        }

        String fileName = System.currentTimeMillis() + "_" + originalFileName;

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        s3.putObject(objectRequest, RequestBody.fromInputStream(updateImageSrc.getInputStream(), updateImageSrc.getSize()));

        accentureUser.setProfilePicUrl(fileName);

        if ( firstName != null ){

            accentureUser.setFirstName(firstName);

        }

        if ( lastName != null ){

            accentureUser.setLastName(lastName);

        }

        if ( about != null ){

            accentureUser.setAbout(about);

        }

        if ( whatILoveAboutMyJob != null ){

            accentureUser.setWhatILoveAboutMyJob(whatILoveAboutMyJob);

        }

        accentureUserRepo.save(accentureUser);

        return "User Updated Successfully" + fileName;

    }

    public AdminProfileModel fetchUserDetails(HttpServletRequest request) {

        String jwtToken = request.getHeader("Authorization").substring(7);

        String userEmail = jwtService.extractUserName(jwtToken);

        AccentureUserEntity fetchedAccentureUser = accentureUserRepo.findByUserEmail(userEmail).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );

        AdminProfileModel adminProfileModel = new AdminProfileModel();

        BeanUtils.copyProperties(fetchedAccentureUser, adminProfileModel);

        return adminProfileModel;

    }

    public List<FetchAllDepartmentsResponseModel> fetchAllDepartments(int pageNumber, int pageSize) {

        List<FetchAllDepartmentsResponseModel> fetchedDepartments = accentureDepartmentsRepo.findAll()
                .stream()
                .sorted(Comparator.comparing(AccentureDepartments::getDepartmentCreatedOn).reversed())
                .map(department -> {

                    FetchAllDepartmentsResponseModel departmentsResponseModel = new FetchAllDepartmentsResponseModel();

                    BeanUtils.copyProperties(department, departmentsResponseModel);

                    return departmentsResponseModel;

                })
                .toList();

        int start = pageNumber * pageSize;
        int end = Math.min(start + pageSize, fetchedDepartments.size());

        // If start index is beyond the size of the list, return an empty list
        if (start >= fetchedDepartments.size()) {
            return new ArrayList<>(); // Return an empty list if no data for the requested page
        }

        return fetchedDepartments.subList(start, end);

    }

    public String addDepartment(String departmentName) {

        AccentureDepartments newDepartment = new AccentureDepartments();

        newDepartment.setDepartmentName(departmentName);
        newDepartment.setDepartmentCreatedOn(new Date(System.currentTimeMillis()));

        accentureDepartmentsRepo.save(newDepartment);

        return "Department Saved";

    }

    public String deleteDepartmentById(Long departmentId) {

        accentureDepartmentsRepo.deleteById(departmentId);

        return "Department Deleted";

    }

    public FetchAllDepartmentsResponseModel getDepartmentById(Long departmentId) throws AccentureDepartmentNotFoundException {

        return accentureDepartmentsRepo.findById(departmentId)
                .map(department -> {

                    FetchAllDepartmentsResponseModel department1 = new FetchAllDepartmentsResponseModel();

                    department1.setId(department.getId());
                    department1.setDepartmentName(department.getDepartmentName());
                    department1.setDepartmentCreatedOn(department.getDepartmentCreatedOn());

                    return department1;

                })
                .orElseThrow(
                () -> new AccentureDepartmentNotFoundException("Accenture Department Not Found")
        );

    }

    public String updateDepartmentById(Long departmentId, String departmentName) throws AccentureDepartmentNotFoundException {

        AccentureDepartments fetchedDepartment = accentureDepartmentsRepo.findById(departmentId).orElseThrow(
                () -> new AccentureDepartmentNotFoundException("Accenture Department Not Found")
        );

        System.out.println("Department Name : " + departmentName);

        if (departmentName != null ){

            fetchedDepartment.setDepartmentName(departmentName);

        }

        accentureDepartmentsRepo.save(fetchedDepartment);

        return "Department Updated";

    }

    public List<AdminDesignationResponseModel> fetchAllDesignations(int pageNumber, int pageSize) {

        List<AdminDesignationResponseModel> fetchedDesignations = accentureDesignationsRepo.findAll()
                .stream()
                .sorted(Comparator.comparing(AccentureDesignations::getDesignationCreatedOn).reversed())
                .map(department -> {

                    AdminDesignationResponseModel departmentsResponseModel = new AdminDesignationResponseModel();

                    BeanUtils.copyProperties(department, departmentsResponseModel);

                    return departmentsResponseModel;

                })
                .toList();

        int start = pageNumber * pageSize;
        int end = Math.min(start + pageSize, fetchedDesignations.size());

        // If start index is beyond the size of the list, return an empty list
        if (start >= fetchedDesignations.size()) {
            return new ArrayList<>(); // Return an empty list if no data for the requested page
        }

        return fetchedDesignations.subList(start, end);

    }

    public String addDesignation(String designationName) {

        AccentureDesignations newDesignation = new AccentureDesignations();

        newDesignation.setDesignationName(designationName);
        newDesignation.setDesignationCreatedOn(new Date(System.currentTimeMillis()));

        accentureDesignationsRepo.save(newDesignation);

        return "Designation Saved";

    }

    public String deleteDesignationById(Long designationId) {

        accentureDesignationsRepo.deleteById(designationId);

        return "Designation Deleted";

    }

    public AdminDesignationResponseModel getDesignationById(Long designationId) throws AccentureDesignationNotFoundException {

        return accentureDesignationsRepo.findById(designationId)
                .map(designation -> {

                    AdminDesignationResponseModel designation1 = new AdminDesignationResponseModel();

                    designation1.setId(designation.getId());
                    designation1.setDesignationName(designation.getDesignationName());
                    designation1.setDesignationCreatedOn(designation.getDesignationCreatedOn());

                    return designation1;

                })
                .orElseThrow(
                        () -> new AccentureDesignationNotFoundException("Accenture Department Not Found")
                );

    }

    public String updateDesignationById(Long designationId, String designationName) throws AccentureDesignationNotFoundException {

        AccentureDesignations fetchedDesignation = accentureDesignationsRepo.findById(designationId).orElseThrow(
                () -> new AccentureDesignationNotFoundException("Accenture Department Not Found")
        );

        System.out.println("Department Name : " + designationName);

        if (designationName != null ){

            fetchedDesignation.setDesignationName(designationName);

        }

        accentureDesignationsRepo.save(fetchedDesignation);

        return "Department Updated";

    }

}

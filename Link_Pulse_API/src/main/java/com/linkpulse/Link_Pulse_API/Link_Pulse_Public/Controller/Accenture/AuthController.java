package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Controller.Accenture;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Error.CompanyNotFoundException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Error.PasswordsNotMatchedException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Error.SubDomainNotFouncException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Error.UserIsLockedException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Model.Accenture.AuthenticationResponseModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Model.Accenture.RegistrationRequestModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Model.AuthenticationRequestModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public")
public class AuthController {

    private final AuthService authService;

    // Registration Method in Controller Layer
    @PostMapping("/register")
    public ResponseEntity<String> register(
            // Validate the request body before proceeding
            @Valid @RequestBody RegistrationRequestModel request
    ) throws PasswordsNotMatchedException, SubDomainNotFouncException {

        // Do the entire business logic in service layer
        String successMessage = authService.register(request);

        // Return the response in ResponseEntity with status 200
        return ResponseEntity.ok(successMessage);

    }

    // Authentication Method in Controller Layer
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseModel> authentication(
            // Validate the request body before proceeding
            @Valid @RequestBody AuthenticationRequestModel request
    ) throws CompanyNotFoundException, UserIsLockedException {

        // Do the entire business logic in service layer
        AuthenticationResponseModel response = authService.authenticate(request);

        // Return the response in ResponseEntity with status 200
        return ResponseEntity.ok(response);

    }


}

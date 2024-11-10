package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.ClientsList.CompanyList;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Role.Role;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Model.Accenture.AuthenticationResponseModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Email.Accenture.EmailSenderService;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureToken;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureUserEntity;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Role.TokenType;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Error.CompanyNotFoundException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Error.PasswordsNotMatchedException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Error.SubDomainNotFouncException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Error.UserIsLockedException;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Model.Accenture.RegistrationRequestModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Model.AuthenticationRequestModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureTokenRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccentureUserRepo accentureUserRepo;

    private final AccentureTokenRepo accentureTokenRepo;

    private final PasswordEncoder passwordEncoder;

    private final EmailSenderService emailSenderService;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    // Registration Method in Service Layer
    public String register(
            RegistrationRequestModel request
    ) throws PasswordsNotMatchedException, SubDomainNotFouncException {

        // Check the passwords are same if yes then proceed
        if ( request.getUserPassword().equals(request.getConformUserPassword()) ){

            // If the subdomain is equal to accenture then run this
            if ( request.getSubDomain().equals(CompanyList.accenture.name()) ){

                AccentureUserEntity accentureUser = new AccentureUserEntity();

                // Copy properties from source to destination
                BeanUtils.copyProperties(request, accentureUser);

                // Set the properties manually which are required
                accentureUser.setUserUnlocked(false);
                accentureUser.setUserPassword(passwordEncoder.encode(request.getUserPassword()));
                accentureUser.setRegisteredDate(new Date(System.currentTimeMillis()));
                accentureUser.setRole(Role.TEAMMEMBER);
                accentureUser.setSubDomain(CompanyList.accenture.name());

                // After modifying the properties just save it in repo
                accentureUserRepo.save(accentureUser);

                // Run the email sending function with threads
                new Thread(() -> {

                    emailSenderService.sendRegistrationEmail(accentureUser.getUserEmail());

                }).start();

                return "User Registered Successfully";

            } else {

                // If the subdomain is not found then throw exception
                throw new SubDomainNotFouncException("Subdomain Not Found");

            }

        }

        // If passwords are not matched then throw exception
        throw new PasswordsNotMatchedException("Passwords Not Matched Exception");

    }

    // Authentication Method in Service Layer
    public AuthenticationResponseModel authenticate(
            AuthenticationRequestModel request
    ) throws CompanyNotFoundException, UserIsLockedException {

        // Convert to lowercase
        String subdomain = request.getSubDomain().toLowerCase();

        // Only execute when the subdomain is accenture
        if ( subdomain.equals(CompanyList.accenture.name()) ){

            AccentureUserEntity accentureUser = accentureUserRepo.findByUserEmail(request.getUserEmail()).orElseThrow(
                    () -> new UsernameNotFoundException("User Not Found")
            );

            if ( accentureUser.isUserUnlocked() ){

                // Check the credentials with AuthenticationManager
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUserEmail(),
                                request.getUserPassword()
                        )
                );

                // Generate Token for specific user
                String jwtToken = jwtService.generateToken(accentureUser, accentureUser.getSubDomain());

                // Revoke all tokens for specific user which are attached
                revokeAccentureUserTokens(accentureUser);

                // Save Token After generating in DB with user
                AccentureToken token = AccentureToken.builder()
                        .token(jwtToken)
                        .tokenType(TokenType.BEARER)
                        .expired(false)
                        .revoked(false)
                        .accentureUser(accentureUser)
                        .build();

                accentureTokenRepo.save(token);

                return AuthenticationResponseModel.builder()
                        .accessToken(jwtToken)
                        .build();

            }else {

                // If the user is locked then throw
                throw new UserIsLockedException("User Is Locked");

            }

        }

        // If the subdomain not matched with our clients then throw
        throw new CompanyNotFoundException(request.getSubDomain() + " Not Found");

    }

    // Revoke all used tokens in Service Layer
    private void revokeAccentureUserTokens(AccentureUserEntity user){

        // Fetch and collect all tokens in List
        List<AccentureToken> validUserTokens = accentureTokenRepo.findAllValidTokensByUser(user.getId());

        // If tokens are empty then stop the function
        if ( validUserTokens.isEmpty() ){

            return;

        }

        // If its not empty then make the tokens useless
        validUserTokens.forEach(token -> {

            token.setExpired(true);
            token.setRevoked(true);

        });

        // After performing al just save the tokens
        accentureTokenRepo.saveAll(validUserTokens);

    }

}

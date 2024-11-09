package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.ClientsList.CompanyList;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Controller.AuthenticationResponseModel;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Email.EmailSenderService;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.Token.AccentureToken;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.User.AccentureUserEntity;
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
import org.springframework.scheduling.annotation.Async;
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

    // Send Registration Successfully Method in Service Layer
    @Async
    private void sendRegistrationEmail(String email) {
        emailSenderService.sendSimpleEmail(
                email,
                "\n\nYou have been registered successfully. Please wait for approval from your admin\n\n",
                "Registration Successful"
        );
    }

    // Registration Method in Service Layer
    public String register(RegistrationRequestModel request, String subDomain) throws PasswordsNotMatchedException, SubDomainNotFouncException {

        if ( request.getUserPassword().equals(request.getConformUserPassword()) ){

            if ( subDomain.equals(CompanyList.ACCENTURE.name()) ){

                AccentureUserEntity accentureUser = new AccentureUserEntity();

                BeanUtils.copyProperties(request, accentureUser);

                accentureUser.setUserUnlocked(false);
                accentureUser.setUserPassword(passwordEncoder.encode(request.getUserPassword()));
                accentureUser.setRegisteredDate(new Date(System.currentTimeMillis()));

                accentureUserRepo.save(accentureUser);

                sendRegistrationEmail(accentureUser.getUserEmail());

                return "User Registered Successfully";

            } else {

                throw new SubDomainNotFouncException("Subdomain Not Found");

            }

        }

        throw new PasswordsNotMatchedException("Passwords Not Matched Exception");

    }

    // Authentication Method in Service Layer
    public AuthenticationResponseModel authenticate(
            AuthenticationRequestModel request,
            String subDomain
    ) throws CompanyNotFoundException, UserIsLockedException {

        // Only execute when the subdomain is accenture
        if ( subDomain.equals(CompanyList.ACCENTURE.name()) ){

            AccentureUserEntity accentureUser = accentureUserRepo.findByEmail(request.getUserEmail()).orElseThrow(
                    () -> new UsernameNotFoundException("User Not Found")
            );

            if ( accentureUser.isUserUnlocked() ){

                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUserEmail(),
                                request.getUserPassword()
                        )
                );

                String jwtToken = jwtService.generateToken(accentureUser);

                revokeAccentureUserTokens(accentureUser);

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
        throw new CompanyNotFoundException(subDomain + " Not Found");

    }

    // Revoke all used tokens in Service Layer
    private void revokeAccentureUserTokens(AccentureUserEntity user){

        List<AccentureToken> validUserTokens = accentureTokenRepo.findAllValidTokensByUser(user.getId());

        if ( validUserTokens.isEmpty() ){

            return;

        }

        validUserTokens.forEach(token -> {

            token.setExpired(true);
            token.setRevoked(true);

        });

        accentureTokenRepo.saveAll(validUserTokens);

    }

}

package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.ClientsList.CompanyList;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureToken;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureTokenRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final AccentureTokenRepo accentureTokenRepo;

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {

        // Extract the authentication header where JwtToken is present
        final String authHeader = request.getHeader("Authorization");

        // Extract the subdomain header where subdomain is present
        final String subdomain = request.getHeader("SubDomainHeaderCustom");

        // If authHeader is not present then just dont proceed
        if ( authHeader == null || !authHeader.startsWith("Bearer") && subdomain == null ){

            return;

        }

        // If authHeader is present and contains JwtToken then extract it
        final String jwtToken = authHeader.substring(7);

        // If subdomain equals to accenture then run this method
        if ( subdomain.equals(CompanyList.accenture.name()) ){

            AccentureToken storedAccentureToken = accentureTokenRepo.findByToken(jwtToken).orElse(null);

            if ( storedAccentureToken != null ){

                storedAccentureToken.setRevoked(true);
                storedAccentureToken.setExpired(true);

                accentureTokenRepo.save(storedAccentureToken);

            }

        }

    }

}

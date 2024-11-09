package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.ClientsList.CompanyList;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.Token.AccentureToken;
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

        final String authHeader = request.getHeader("Authorization");

        final String subdomain = request.getHeader("SubDomainHeaderCustom");

        if ( authHeader == null || !authHeader.startsWith("Bearer") && subdomain == null ){

            return;

        }

        final String jwtToken = authHeader.substring(7);

        if ( subdomain.equals(CompanyList.ACCENTURE.name()) ){

            AccentureToken storedAccentureToken = accentureTokenRepo.findByToken(jwtToken).orElse(null);

            if ( storedAccentureToken != null ){

                storedAccentureToken.setRevoked(true);
                storedAccentureToken.setExpired(true);

                accentureTokenRepo.save(storedAccentureToken);

            }

        }

    }

}

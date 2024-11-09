package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Config;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureTokenRepo;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service.JwtService;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilterChain extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final MyUserDetailsService myUserDetailsService;

    private final AccentureTokenRepo accentureTokenRepo;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        final String subDomain = request.getHeader("SubDomainHeaderCustom");

        if (authHeader == null || !authHeader.startsWith("Bearer ") || subDomain == null ){

            filterChain.doFilter(request, response);

            return;

        }

        final String jwtToken = authHeader.substring(7);

        final String userEmail = jwtService.extractUserName(jwtToken);

        if ( userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null ){

            UserDetails userDetails = myUserDetailsService.loadUserByUsernameAndSubdomain(userEmail, subDomain);

            boolean isTokenValid = accentureTokenRepo.findByToken(jwtToken)
                    .map(token -> !token.isExpired() && !token.isRevoked() )
                    .orElse(false);

            if ( jwtService.isTokenValid(jwtToken, userDetails) && isTokenValid ){

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);

            }

        } else {

            throw new UsernameNotFoundException("User Not Found");

        }

        filterChain.doFilter(request, response);

    }

}

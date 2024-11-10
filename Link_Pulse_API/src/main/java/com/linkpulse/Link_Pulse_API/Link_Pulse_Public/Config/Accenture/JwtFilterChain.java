package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Config.Accenture;

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

        // Get the header value for Jwt Token with name "Authorization"
        final String authHeader = request.getHeader("Authorization");

        // If the jwt token and subdomain is not available then just stop proceeding
        if (authHeader == null || !authHeader.startsWith("Bearer ")){

            filterChain.doFilter(request, response);

            return;

        }

        // Now jwt token is available so we are extracting it and storing it in jwtToken variable
        final String jwtToken = authHeader.substring(7);

        // Now we are extracting subDomain and then storing in subDomain variable with the help of extractSubDomain method from JwtService Class
        final String subDomain = jwtService.extractSubDomain(jwtToken);

        // Now we are extracting userEmail and then storing in userEmail variable with the help of extractUserName method from JwtService Class
        final String userEmail = jwtService.extractUserName(jwtToken);

        // If the userEmail is not null and user is not authorized then we will proceed
        if ( userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null ){

            // Load the user based on subdomain
            UserDetails userDetails = myUserDetailsService.loadUserByUsernameAndSubdomain(userEmail, subDomain);

            // Checking current Jwt Token is valid or not
            boolean isTokenValid = accentureTokenRepo.findByToken(jwtToken)
                    .map(token -> !token.isExpired() && !token.isRevoked() )
                    .orElse(false);
            // If the current Jwt Token is valid then we will proceed
            if ( jwtService.isTokenValid(jwtToken, userDetails) && isTokenValid ){

                // Creating authentication object for next step
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // Saving the user as authorized
                SecurityContextHolder.getContext().setAuthentication(authToken);

            }

        } else {

            // If the user is not present then throw exception
            throw new UsernameNotFoundException("User Not Found");

        }

        // After making all then we will pass our request and response to remaining Filter Chains
        filterChain.doFilter(request, response);

    }

}

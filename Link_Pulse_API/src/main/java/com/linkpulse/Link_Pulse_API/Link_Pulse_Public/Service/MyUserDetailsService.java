package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.ClientsList.CompanyList;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureUserEntity;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final AccentureUserRepo accentureUserRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Fetch the user if not then throw exception
        AccentureUserEntity fetchedAccentureUser = accentureUserRepo.findByUserEmail(username).orElseThrow(
                () -> new UsernameNotFoundException("Accenture User Not Found")
        );

        // if fetchedAccentureUser is not null then run this logic
        if ( fetchedAccentureUser != null ){

            return fetchedAccentureUser;

        }

        // If user is not present then throw exception
        throw new UsernameNotFoundException("User Not Found");

    }

    public UserDetails loadUserByUsernameAndSubdomain(String userEmail, String subDomain){

        // If subdomain is equal to accenture then run this method
        if (subDomain.equals(CompanyList.accenture.name())){

            return accentureUserRepo.findByUserEmail(userEmail).orElseThrow(
                    () -> new UsernameNotFoundException("Accenture User Not Found")
            );

        }

        // If subdomain is not matched with our subdomains then just throw exception
        throw new UsernameNotFoundException("User Not Found");

    }

}

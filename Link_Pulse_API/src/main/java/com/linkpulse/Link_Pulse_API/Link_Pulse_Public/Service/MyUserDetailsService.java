package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.ClientsList.CompanyList;
import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.User.AccentureUserEntity;
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

        AccentureUserEntity fetchedAccentureUser = accentureUserRepo.findByEmail(username).orElseThrow(
                () -> new UsernameNotFoundException("Accenture User Not Found")
        );

        if ( fetchedAccentureUser != null ){

            return fetchedAccentureUser;

        }

        throw new UsernameNotFoundException("User Not Found");

    }

    public UserDetails loadUserByUsernameAndSubdomain(String userEmail, String subDomain){

        if (subDomain.equals(CompanyList.ACCENTURE.name())){

            return accentureUserRepo.findByEmail(userEmail).orElseThrow(
                    () -> new UsernameNotFoundException("Accenture User Not Found")
            );

        }

        throw new UsernameNotFoundException("User Not Found");

    }

}

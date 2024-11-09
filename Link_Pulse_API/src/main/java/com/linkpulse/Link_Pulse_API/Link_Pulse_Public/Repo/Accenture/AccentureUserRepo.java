package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccentureUserRepo extends JpaRepository<AccentureUserEntity, Long> {

    Optional<AccentureUserEntity> findByUserEmail(String username);

}

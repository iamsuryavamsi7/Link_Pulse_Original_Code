package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Entity.Accenture.Entities.AccentureToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AccentureTokenRepo extends JpaRepository<AccentureToken, Long> {

    @Query("""        
        SELECT t FROM AccentureToken t INNER JOIN t.accentureUser u
        WHERE u.id = :userId AND (t.expired = false OR t.revoked = false)
    """)
    List<AccentureToken> findAllValidTokensByUser(Long userId);

    Optional<AccentureToken> findByToken(String accentureToken);

    @Query(
            value = "DELETE FROM accenture_token_table \n" +
                    "WHERE expired = true OR revoked = true",
            nativeQuery = true
    )
    void deleteTokensByExpiredOrRevoked();

}

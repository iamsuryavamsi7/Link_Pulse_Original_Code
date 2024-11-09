package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Schedule;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Repo.Accenture.AccentureTokenRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScheduleTokenDelete {

    private final AccentureTokenRepo accentureTokenRepo;

    @Scheduled(
            fixedRate = 600000      // 10 minutes
    )
    public void deleteExpiredOrRevokedTokens(){

        accentureTokenRepo.deleteTokensByExpiredOrRevoked();

        System.out.println("Tokens Deleted");

    }

}
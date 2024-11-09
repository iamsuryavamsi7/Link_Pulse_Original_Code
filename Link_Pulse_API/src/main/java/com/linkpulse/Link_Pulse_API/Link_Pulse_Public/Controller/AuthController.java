package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Controller;

import com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public")
public class AuthController {

    private final AuthService authService;



}

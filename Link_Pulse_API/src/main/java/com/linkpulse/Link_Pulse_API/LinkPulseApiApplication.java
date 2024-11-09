package com.linkpulse.Link_Pulse_API;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LinkPulseApiApplication {

	public static void main(String[] args) {

		SpringApplication.run(LinkPulseApiApplication.class, args);

		System.out.println("\n\n\nProject is fine... \n\n\n");

	}

}

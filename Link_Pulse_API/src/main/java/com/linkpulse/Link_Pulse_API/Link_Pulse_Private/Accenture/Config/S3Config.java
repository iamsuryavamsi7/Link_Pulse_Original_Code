package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    @Value("${cloud.aws.keys.accenture.access-key}")
    private String accessKey;

    @Value("${cloud.aws.keys.accenture.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.keys.accenture.bucket-name}")
    private String region;

    @Bean
    public S3Client s3Client(){

        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);

        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();

    }

}

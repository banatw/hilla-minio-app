package com.example.application.config;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.minio.MinioClient;
import okhttp3.OkHttpClient;

@Configuration
public class Myconfig {
    @Value("${minio.access.name}")
    String accessKey;
    @Value("${minio.access.secret}")
    String accessSecret;
    @Value("${minio.url}")
    String minioUrl;


    @Bean
    MinioClient generateMinioClient() {
        try {
            OkHttpClient httpClient = new OkHttpClient.Builder()
                    .connectTimeout(10, TimeUnit.MINUTES)
                    .writeTimeout(10, TimeUnit.MINUTES)
                    .readTimeout(30, TimeUnit.MINUTES)
                    .build();

            MinioClient client = MinioClient.builder()
                .endpoint(minioUrl)
                .httpClient(httpClient) 
                .credentials(accessKey, accessSecret)
                .build();
            return client;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}

package com.example.application;

import com.example.application.data.Arsip;
import com.example.application.data.ArsipRepository;
import com.example.application.data.Role;
import com.example.application.data.User;
import com.example.application.data.UserRepository;
import com.example.application.services.UploadServices;
import com.vaadin.flow.component.dependency.StyleSheet;
import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.theme.lumo.Lumo;

import java.io.File;
import java.io.InputStream;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * The entry point of the Spring Boot application.
 *
 * Use the @PWA annotation make the application installable on phones, tablets
 * and some desktop browsers.
 *
 */
@SpringBootApplication
@StyleSheet(Lumo.STYLESHEET)
@StyleSheet(Lumo.UTILITY_STYLESHEET)
public class Application implements AppShellConfigurator {
    @Autowired
    private UserRepository userRepository;
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner() {
        return x -> {
            User adminUser = new User();
            adminUser.setHashedPassword(new BCryptPasswordEncoder().encode("admin"));
            adminUser.setName("admin");
            adminUser.setUsername("admin");
            adminUser.setRoles(Set.of(Role.ADMIN,Role.USER));
            userRepository.save(adminUser);
        };
    }
}

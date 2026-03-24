package com.example.application.config;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.application.data.User;
import com.example.application.security.AuthenticatedUser;

@Component
@EnableJpaAuditing(auditorAwareRef = "getAuditor")
public class MyJpaAuditor {
    private final AuthenticatedUser authenticatedUser;
    
    
    public MyJpaAuditor(AuthenticatedUser authenticatedUser) {
        this.authenticatedUser = authenticatedUser;
    }

    @Bean
    AuditorAware<String> getAuditor() {
        return new AuditorAwareImple();
    }

    class AuditorAwareImple implements AuditorAware<String> {

        @Override
        public Optional<String> getCurrentAuditor() {
           Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return Optional.of("anonim");
            }
            return Optional.of(auth.getName());
        }

    }
}

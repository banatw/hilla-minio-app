package com.example.application.security;

import com.example.application.data.User;
import com.example.application.data.UserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import com.vaadin.flow.spring.security.AuthenticationContext;


import java.util.Optional;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AuthenticatedUser {

    private final UserRepository userRepository;
    private final AuthenticationContext authenticationContext;

    public AuthenticatedUser(AuthenticationContext authenticationContext, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.authenticationContext = authenticationContext;
    }

    @Transactional
    public Optional<User> get() {
        // return authenticationContext.getAuthenticatedUser(JwtDsl.class)
        //         .flatMap(userDetails -> {
        //             try {
        //                 return userRepository.findByUsername(userDetails.getJwkSe);
        //             } catch (ParseException e) {
        //                 // TODO Auto-generated catch block
        //                 e.printStackTrace();
        //             }
        //             return java.util.Optional.empty();
        //         });
        SecurityContext context = SecurityContextHolder.getContext();
        Object principal = context.getAuthentication().getPrincipal();
        if( principal instanceof Jwt) {
            String username = ((Jwt)principal).getSubject();
            return userRepository.findByUsername(username);
        }
        return Optional.empty();
    }

    public void logout() {
        authenticationContext.logout();
    }

}

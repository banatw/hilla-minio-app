package com.example.application.services;

import java.util.List;

import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.application.data.Arsip;
import com.example.application.data.ArsipSpecification;
import com.example.application.data.ArsipRepository;
import com.vaadin.hilla.BrowserCallable;

import jakarta.annotation.security.RolesAllowed;

@BrowserCallable
public class ArsipPerUserService {
    private final ArsipRepository arsipRepository;

    public ArsipPerUserService(ArsipRepository repository) {
        this.arsipRepository = repository;
    }

    @RolesAllowed({"USER","ADMIN"})
    public @NonNull List<@NonNull Arsip> list(Pageable pageable,String filter) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String auditUser = auth.getName();
        ArsipSpecification arsipPerUserFilter = new ArsipSpecification(auditUser, filter, filter);
        return arsipRepository.findAll(arsipPerUserFilter);
    }
}

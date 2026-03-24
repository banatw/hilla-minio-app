package com.example.application.services;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.jspecify.annotations.NonNull;

import com.example.application.data.Role;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class RoleService {
    
    public @NonNull List<@NonNull String> roles() {
        return Stream.of(Role.values()).map(Role::name).collect(Collectors.toList());
    }
}

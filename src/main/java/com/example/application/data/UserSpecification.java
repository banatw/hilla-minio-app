package com.example.application.data;

import java.util.ArrayList;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class UserSpecification implements Specification<User> {
    private final String username;
    private final String name;

    

    public UserSpecification(String username, String name) {
        this.username = username;
        this.name = name;
    }

    @Override
    public @Nullable Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        // TODO Auto-generated method stub
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("username")),"%" + username.toLowerCase() + "%"));
        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),"%" + name.toLowerCase() + "%"));
        return criteriaBuilder.or(predicates.toArray(Predicate[]::new));
    }


    // @Override
    // public @Nullable Predicate toPredicate(Root<Arsip> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    //     // TODO Auto-generated method stub
    //     List<Predicate> predicates = new ArrayList<>();

    //     if(!fileName.isEmpty()) {
    //         predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("fileName")),"%" + fileName.toLowerCase() + "%"));
    //     }
    //     if(!name.isEmpty()) {
    //         predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),"%" + name.toLowerCase() + "%"));
    //     }
    //     if(!auditUser.isEmpty()) {
    //         predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("auditUser")),auditUser.toLowerCase()));
    //     }
    //     return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
    // }
    
}

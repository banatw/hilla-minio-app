package com.example.application.data;

import java.util.ArrayList;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ArsipSpecification implements Specification<Arsip> {
    private final String auditUser;
    private final String fileName;
    private final String name;

    

    public ArsipSpecification(String auditUser, String fileName, String name) {
        this.auditUser = auditUser;
        this.fileName = fileName;
        this.name = name;
    }


    @Override
    public @Nullable Predicate toPredicate(Root<Arsip> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        // TODO Auto-generated method stub
        // List<Predicate> filtePredicates = new ArrayList<>();
        // List<Predicate> usernamePredicates = new ArrayList<>();
        Predicate filterPredicate =null;
        Predicate fileNamePredicate = null;
        Predicate namePredicate = null;
        Predicate usernamePredicate = null;

        // if(!fileName.isEmpty()) {
        fileNamePredicate =  criteriaBuilder.like(criteriaBuilder.lower(root.get("fileName")),"%" + fileName.toLowerCase() + "%");
        // }
        // if(!name.isEmpty()) {
        namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),"%" + name.toLowerCase() + "%");
        // }
        filterPredicate = criteriaBuilder.or(fileNamePredicate,namePredicate);

        usernamePredicate = criteriaBuilder.equal(criteriaBuilder.lower(root.get("auditUser")),auditUser.toLowerCase());
        
        return criteriaBuilder.and(fileNamePredicate,usernamePredicate);    }
    
}

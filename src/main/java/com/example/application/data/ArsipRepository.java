package com.example.application.data;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ArsipRepository extends JpaRepository<Arsip,Long>, JpaSpecificationExecutor<Arsip> {
    List<Arsip> findByAuditUserAndFileNameContainingIgnoreCaseOrNameContainingIgnoreCase(String auditUser,String filename
        , String name, Pageable pageable);
}

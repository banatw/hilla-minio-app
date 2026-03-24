package com.example.application.data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
@EntityListeners(AuditingEntityListener.class)
public class Arsip {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "tidak boleh kosong")
    private String name;

    private String fileName;
    private String mimeType;
    private String s3FileName;

    @Transient
    private String file;

    @LastModifiedBy
    @CreatedBy
    private String auditUser;

    @UpdateTimestamp
    @JsonIgnore
    private LocalDateTime auditDate;
}

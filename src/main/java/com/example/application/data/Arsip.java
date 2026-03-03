package com.example.application.data;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
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
}

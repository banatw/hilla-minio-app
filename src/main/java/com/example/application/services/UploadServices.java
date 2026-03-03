package com.example.application.services;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.io.IOUtils;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import jakarta.annotation.Nonnull;

@BrowserCallable
@AnonymousAllowed
@Service
public class UploadServices {
    private final MinioClient minioClient;
    
    public UploadServices(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Nonnull
    public String uploadFile(MultipartFile multipartFile) throws IllegalArgumentException, IOException, InsufficientDataException, InvalidResponseException,
     NoSuchAlgorithmException, ServerException, XmlParserException, InvalidKeyException, ErrorResponseException, InternalException {
        Map<String,String> tags = new HashMap<>();
        PutObjectArgs args = PutObjectArgs
            .builder()
                .bucket("my-bucket")    
                .contentType(multipartFile.getContentType())
                .object(multipartFile.getOriginalFilename())
                .stream(multipartFile.getInputStream(), multipartFile.getInputStream().available(), -1)
                .build();
        minioClient.putObject(args);  
        multipartFile.getInputStream().close();
        return multipartFile.getOriginalFilename();
    }

    @Nonnull
    public String deleteFile(String fileName) throws IllegalArgumentException, IOException, InsufficientDataException, InvalidResponseException,
     NoSuchAlgorithmException, ServerException, XmlParserException, InvalidKeyException, ErrorResponseException, InternalException {
        Map<String,String> tags = new HashMap<>();
        RemoveObjectArgs args = RemoveObjectArgs
            .builder()
                .bucket("my-bucket")    
                .object(fileName)
                .build();
        minioClient.removeObject(args);
        return fileName;
    }
   
    @NonNull
    public byte[] getFile(String filename) throws InvalidKeyException, ErrorResponseException, InsufficientDataException, InternalException, InvalidResponseException, NoSuchAlgorithmException, ServerException, XmlParserException, IOException {
        GetObjectArgs args = GetObjectArgs.builder()
                        .bucket("my-bucket")
                        .object(filename)
                        .build();
            try(InputStream rStream = minioClient.getObject(args)) {
                return IOUtils.toByteArray(rStream);
            }
    }

}

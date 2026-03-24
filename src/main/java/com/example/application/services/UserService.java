package com.example.application.services;

import com.example.application.data.User;
import com.example.application.data.UserRepository;
import com.example.application.data.UserSpecification;
import com.vaadin.hilla.BrowserCallable;

import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;

import java.io.File;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@BrowserCallable
@RolesAllowed({"ADMIN","USER"})
public class UserService {

    private final UserRepository repository;
    private final UploadServices uploadServices;

    public UserService(UserRepository repository, UploadServices services) {
        this.repository = repository;
        this.uploadServices = services;
    }

    @Transactional
    public Optional<User> get(Long id) throws InvalidKeyException, ErrorResponseException, InsufficientDataException, InternalException, InvalidResponseException, NoSuchAlgorithmException, ServerException, XmlParserException, IOException {
        Optional<User> user = repository.findById(id);
        if(user.get().isHasProfilePicture()){
            user.get().setProfilePictureUriData(uploadServices.getFileBase64(user.get().getS3FileName()));
        }
        return user;
    }

    public User save(User entity) throws InvalidKeyException, ErrorResponseException, InsufficientDataException, InternalException, InvalidResponseException, NoSuchAlgorithmException, ServerException, XmlParserException, IOException {
        User user = get(entity.getId()).get();
        if(!user.getHashedPassword().equals(entity.getHashedPassword())) {
            entity.setHashedPassword(new BCryptPasswordEncoder().encode(entity.getHashedPassword()));
        }
        return repository.save(entity);
    }

    public User saveAdd(User entity) {
        // String fileName = "profile_" + UUID.randomUUID().toString();
        // entity.setPictureMimeType("image/png");
        // entity.setProfilePictureFileName(fileName);
        entity.setHashedPassword(new BCryptPasswordEncoder().encode(entity.getHashedPassword()));
        User user2 = repository.save(entity);
        // if(user2 != null) {
        //     uploadServices.uploadDefaultFile(fileName, "image/png");
        // }
        return user2;
    }

    public User newUser() {
        return new User();
    }

    public void delete(Long id) throws InvalidKeyException, IllegalArgumentException, InsufficientDataException, InvalidResponseException, NoSuchAlgorithmException, ServerException, XmlParserException, ErrorResponseException, InternalException, IOException {
        User user = repository.findById(id).get();
        if(user.isHasProfilePicture()) {
            uploadServices.deleteFile(user.getS3FileName());
        }
        repository.deleteById(id);
    }

    public Page<User> list(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<User> list(Pageable pageable, Specification<User> filter) {
        return repository.findAll(filter, pageable);
    }

    public int count() {
        return (int) repository.count();
    }

    public @NonNull List<@NonNull User> listWithFilter(Pageable pageable,String filter) {
        UserSpecification userSpecification = new UserSpecification(filter, filter);
        return repository.findAll(userSpecification);
    }

    
}

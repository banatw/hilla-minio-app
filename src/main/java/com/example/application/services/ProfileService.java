package com.example.application.services;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

import org.springframework.mock.web.MockMultipartFile;

import com.example.application.data.User;
import com.example.application.data.UserRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import lombok.extern.slf4j.Slf4j;

@BrowserCallable
@AnonymousAllowed
@Slf4j
public class ProfileService {
    private final UserRepository repository;
    private final UploadServices uploadServices;
    private final UserService userService;
    public ProfileService(UserRepository repository, UploadServices uploadServices,UserService userService) {
        this.repository = repository;
        this.uploadServices = uploadServices;
        this.userService = userService;
    }

    public User saveEditWithPicture(User user) throws Exception {
        String[] base64;
        User oldUser = userService.get(user.getId()).get();
        String fileName = null;
        if(user.isHasProfilePicture()) {
            if(oldUser.getS3FileName().equals("") )  fileName = UUID.randomUUID().toString();
            else fileName = oldUser.getS3FileName();
            user.setS3FileName(fileName);
            if(oldUser.getProfilePictureUriData().equals(user.getProfilePictureUriData())) {
                return repository.save(user);
            }
            else {
                base64 = user.getProfilePictureUriData().split(",");
                User user3 = repository.save(user);
                byte[] byteArray = Base64.getDecoder().decode(base64[1]);
                MockMultipartFile mockMultipartFile = new MockMultipartFile(user.getName(),fileName, user.getProfilePictureMimeType(), byteArray);
                try {
                    uploadServices.uploadFile(mockMultipartFile);
                    return user3;
                } catch (InvalidKeyException | IllegalArgumentException | InsufficientDataException
                        | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException
                        | ErrorResponseException | InternalException | IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }
        else {
            if(!oldUser.getS3FileName().equals("")) uploadServices.deleteFile(user.getS3FileName());
            user.setS3FileName("");
            return repository.save(user);
        }
        return null;
        
    }
    
}

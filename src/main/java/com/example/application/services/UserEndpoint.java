package com.example.application.services;

import com.example.application.data.User;
import com.example.application.security.AuthenticatedUser;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;

@BrowserCallable
@AnonymousAllowed
public class UserEndpoint {
    private final UploadServices uploadServices;

    public UserEndpoint(UploadServices services) {
        this.uploadServices = services;
    }

    @Autowired
    private AuthenticatedUser authenticatedUser;

    @Transactional
    public Optional<User> getAuthenticatedUser() throws InvalidKeyException, ErrorResponseException, InsufficientDataException, InternalException, InvalidResponseException, NoSuchAlgorithmException, ServerException, XmlParserException, IOException {
        Optional<User> user = authenticatedUser.get();
        if(user.isPresent()) {
            if(user.get().isHasProfilePicture() ) {
                String profilePictureString = "data:" + user.get().getProfilePictureMimeType() + ";base64," +uploadServices.getFileBase64(user.get().getS3FileName());
                user.get().setProfilePictureUriData(profilePictureString);
                return user;
            }
            else {
                // user.get().setProfilePictureUriData("");
                return user;
            }
        }
        return null;
        // return authenticatedUser.get();
    }
}

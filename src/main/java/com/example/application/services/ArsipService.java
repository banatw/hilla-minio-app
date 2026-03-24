package com.example.application.services;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import org.bouncycastle.jcajce.provider.asymmetric.ec.SignatureSpi.ecDSARipeMD160;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.example.application.data.Arsip;
import com.example.application.data.ArsipRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.ListRepositoryService;

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
public class ArsipService extends ListRepositoryService<Arsip,Long,ArsipRepository> {
    private final ArsipRepository employeeRepository;
    private final UploadServices uploadServices;
    
    public ArsipService(ArsipRepository employeeRepository, UploadServices uploadServices) {
        this.employeeRepository = employeeRepository;
        this.uploadServices = uploadServices;
    }

    

    @NonNull
    public Arsip save(@NonNull Arsip employee) throws Exception {
        String[] base64; 
        if(employee.getFile()==null) {
            throw new Exception("FIle Upload tidak ada");
        }
        base64 = employee.getFile().split(",");
        String s3FileName = UUID.randomUUID().toString();
        employee.setS3FileName(s3FileName);
        Arsip employee2 = employeeRepository.save(employee);
        if(employee2!=null) {
            byte[] byteArray = Base64.getDecoder().decode(base64[1]);
            MockMultipartFile mockMultipartFile = new MockMultipartFile(employee.getName(), employee.getS3FileName(), employee.getMimeType(), byteArray);
            try {
                uploadServices.uploadFile(mockMultipartFile);
            } catch (InvalidKeyException | IllegalArgumentException | InsufficientDataException
                    | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException
                    | ErrorResponseException | InternalException | IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return employee2;
    }

    @NonNull
    public Arsip saveEdit(@NonNull Arsip employee) throws Exception {
        String[] base64; 
        if(employee.getFile()==null) {
            throw new Exception("FIle Upload tidak ada");
        }
        base64 = employee.getFile().split(",");
        Arsip employee2 = employeeRepository.save(employee);
        if(employee2!=null) {
            byte[] byteArray = Base64.getDecoder().decode(base64[1]);
            MockMultipartFile mockMultipartFile = new MockMultipartFile(employee.getName(), employee.getS3FileName(), employee.getMimeType(), byteArray);
            try {
                uploadServices.uploadFile(mockMultipartFile);
            } catch (InvalidKeyException | IllegalArgumentException | InsufficientDataException
                    | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException
                    | ErrorResponseException | InternalException | IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return employee2;
    }

    @NonNull
    public Arsip delete(Arsip employee) {
        employeeRepository.deleteById(employee.getId());
        try {
            uploadServices.deleteFile(employee.getS3FileName());
        } catch (InvalidKeyException | IllegalArgumentException | InsufficientDataException | InvalidResponseException
                | NoSuchAlgorithmException | ServerException | XmlParserException | ErrorResponseException
                | InternalException | IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        return employee;
    }

    @NonNull
    public Arsip add() {
        return new Arsip();
    }

    public Arsip getById(@NonNull Long id) {
        Arsip employee = employeeRepository.findById(id).get();
        byte[] filebyteArray = null;
        try {
            
            filebyteArray = uploadServices.getFile(employee.getS3FileName());
            String fileBase64 = Base64.getEncoder().encodeToString(filebyteArray);
            String file = "data:" + employee.getMimeType() + ";base64," + fileBase64;
            employee.setFile(file);
            // log.info(employee.getFile());
            return employee;
        } catch (InvalidKeyException | ErrorResponseException | InsufficientDataException | InternalException
                | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException
                | IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }
}

package com.example.Post_Services.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "Uploader-Service")
public interface UploaderServiceClient {

    @PostMapping(
            value = "/upload/file",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    ResponseEntity<String> uploadFile(
            @RequestPart("file") MultipartFile file
    );
}

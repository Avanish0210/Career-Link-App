package com.example.Uploader_Service;

import com.example.Uploader_Service.service.UploaderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class UploaderController {

    private final UploaderService uploaderService;
    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam MultipartFile file){
        String url = uploaderService.upload(file);
        return ResponseEntity.ok(url);
    }
}

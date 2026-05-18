package com.example.Post_Services.controller;

import com.example.Post_Services.auth.AuthContextHolder;
import com.example.Post_Services.dto.PostCreateRequestDto;
import com.example.Post_Services.dto.PostDto;
import com.example.Post_Services.entity.Post;
import com.example.Post_Services.service.PostServices;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
public class PostController {

    private final PostServices postServices;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDto> createPost(@RequestPart("post") PostCreateRequestDto postDto ,
                                              @RequestPart("file") MultipartFile file) {
        PostDto createdPost = postServices.createPost(postDto  ,  file);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId) {
        Long userId = AuthContextHolder.getCurrentUserId();
        PostDto post = postServices.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/users/{userId}/allPosts")
    private ResponseEntity<List<PostDto>> getAllPosts(@PathVariable long userId) {
        List<PostDto> posts = postServices.getAllPostOfUser(userId);
        return ResponseEntity.ok(posts);
    }





}

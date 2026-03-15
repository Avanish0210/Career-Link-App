package com.example.Post_Services.controller;

import com.example.Post_Services.service.PostLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/likes")
@RestController
@RequiredArgsConstructor
public class LikeController {
    private final PostLikeService postLikeService;

    @PostMapping("/{postId}")
    private ResponseEntity<Void> likePost(@PathVariable Long postId){
        postLikeService.likePostByPostId(postId , 1L);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{postId}")
    private ResponseEntity<Void> deletePost(@PathVariable Long postId){
        postLikeService.unlikePost(postId , 1L);
        return ResponseEntity.noContent().build();
    }
}

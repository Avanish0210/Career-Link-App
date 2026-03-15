package com.example.Post_Services.service;

import com.example.Post_Services.entity.PostLike;
import com.example.Post_Services.exception.BadRequestException;
import com.example.Post_Services.exception.ResourceNotFoundException;
import com.example.Post_Services.repository.PostLikeRepository;
import com.example.Post_Services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostLikeService {
    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;


    public void likePostByPostId(long postId , Long userId) {
        boolean isExist = postRepository.existsById(postId);
        if(!isExist) throw new ResourceNotFoundException("Post Not Found");

        boolean alreadyLike = postLikeRepository.existsByUserIdAndPostId(postId , userId);
        if(alreadyLike) throw new BadRequestException("Cannot like the same post again.");

        PostLike postLike = new PostLike();
        postLike.setPostId(postId);
        postLike.setUserId(userId);
        postLikeRepository.save(postLike);

    }


    public void unlikePost(Long postId , Long userId) {
        boolean isExist = postRepository.existsById(postId);
        if(!isExist) throw new ResourceNotFoundException("Post Not Found");

        boolean alreadyLike = postLikeRepository.existsByUserIdAndPostId(userId , postId);
        if(!alreadyLike) throw new BadRequestException("Cannot unlike the post which is not liked.");

        postLikeRepository.deleteByUserIdAndPostId(userId , postId);

    }
}

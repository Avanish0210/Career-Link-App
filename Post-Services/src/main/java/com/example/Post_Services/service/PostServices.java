package com.example.Post_Services.service;

import com.example.Post_Services.dto.PostCreateRequestDto;
import com.example.Post_Services.dto.PostDto;
import com.example.Post_Services.entity.Post;
import com.example.Post_Services.exception.ResourceNotFoundException;
import com.example.Post_Services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServices {
    private final PostRepository postRepository;
    private final ModelMapper modelMapper;

    public PostDto createPost(PostCreateRequestDto postDto , Long userId) {
        Post post = modelMapper.map(postDto, Post.class);
        post.setUserId(userId);

        Post savePost = postRepository.save(post);
        return modelMapper.map(savePost, PostDto.class);
    }

    public PostDto getPostById(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() ->new ResourceNotFoundException("Post Not found"));
        return modelMapper.map(post, PostDto.class);
    }


    public List<PostDto> getAllPostOfUser(Long userId) {

        List<Post> post = postRepository.findByUserId(userId);

        return post.stream()
                .map((elements) ->modelMapper.map(elements ,PostDto.class))
                .collect(Collectors.toList());
    }


}

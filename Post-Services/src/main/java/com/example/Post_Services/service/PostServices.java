package com.example.Post_Services.service;

import com.example.Post_Services.auth.AuthContextHolder;
import com.example.Post_Services.client.ConnectionsServiceClient;
import com.example.Post_Services.client.UploaderServiceClient;
import com.example.Post_Services.dto.PersonDto;
import com.example.Post_Services.dto.PostCreateRequestDto;
import com.example.Post_Services.dto.PostDto;
import com.example.Post_Services.entity.Post;
import com.example.Post_Services.event.PostCreated;
import com.example.Post_Services.exception.ResourceNotFoundException;
import com.example.Post_Services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServices {
    private final PostRepository postRepository;
    private final ModelMapper modelMapper;
    private final ConnectionsServiceClient connectionsServiceClient;
    private final UploaderServiceClient uploaderServiceClient;
    private final KafkaTemplate<Long, PostCreated> postCreatedKafkaTemplate;

    public PostDto createPost(PostCreateRequestDto postDto , MultipartFile file) {
        Long userId = AuthContextHolder.getCurrentUserId();

        ResponseEntity<String> imageUrl = uploaderServiceClient.uploadFile(file);


        Post post = modelMapper.map(postDto, Post.class);
        post.setUserId(userId);
        post.setImageUrl(imageUrl.getBody());
        Post savePost = postRepository.save(post);

        List<PersonDto> personDtoList = connectionsServiceClient.getFirstDegreeConnections(userId);

        for(PersonDto person: personDtoList) { // send notification to each connection
            PostCreated postCreated = PostCreated.builder()
                    .postId(post.getId())
                    .content(post.getContent())
                    .userId(person.getUserId())
                    .ownerUserId(userId)
                    .build();
            postCreatedKafkaTemplate.send("post_created_topic", postCreated);
        }

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

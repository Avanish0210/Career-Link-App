package com.example.Post_Services.repository;

import com.example.Post_Services.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post , Long> {

    List<Post> findByUserId(long userId);
}

package com.example.notification_service.consumer;

import com.example.Post_Services.event.PostCreated;
import com.example.Post_Services.event.PostLiked;
import com.example.notification_service.entity.Notification;
import com.example.notification_service.service.NotificationService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostConsumer {
    private final NotificationService notificationService;

    @KafkaListener(topics = "post_created_topic")
    public void handlePostCreated(Long userId , PostCreated postCreated){
        log.info("handlePostCreated: {}", postCreated);
        try {
            String message = String.format("Your connection with id: %d has created this post: %s",
                    postCreated.getOwnerUserId(), postCreated.getContent());
            Notification notification = Notification.builder()
                    .message(message)
                    .userId(userId)
                    .build();

            notificationService.addNotification(notification);
        } catch (Exception ex) {
            log.error("Failed to process post_created_topic event: {}", postCreated, ex);
        }
    }

    @KafkaListener(topics = "post_liked_topic")
    public void handlePostLiked(PostLiked postLiked){
        log.info("handlePostLiked: {}", postLiked);
        try {
            String message = String.format("User with id: %d has liked your post with id: %d",
                    postLiked.getLikedByUserId(), postLiked.getPostId());

            Notification notification = Notification.builder()
                    .message(message)
                    .userId(postLiked.getOwnerUserId())
                    .build();

            notificationService.addNotification(notification);
        } catch (Exception ex) {
            log.error("Failed to process post_liked_topic event: {}", postLiked, ex);
        }
    }
}

package com.example.connections_service.consumer;

import com.example.User_Services.event.UserCreatedEvent;
import com.example.connections_service.service.PersonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceConsumer {

    private final PersonService personService;

    @KafkaListener(topics = "user-created_topic")
    public void handlePersonCreated(UserCreatedEvent userCreatedEvent){
        log.info("handlePersonCreated: {}", userCreatedEvent);
        personService.createPerson(userCreatedEvent.getUserId() , userCreatedEvent.getName());
    }
}

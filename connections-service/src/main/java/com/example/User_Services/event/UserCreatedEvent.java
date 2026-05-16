package com.example.User_Services.event;

import lombok.Data;

@Data
public class UserCreatedEvent {
    private Long userId;
    private String name;
}

package com.example.User_Services.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String password;
}

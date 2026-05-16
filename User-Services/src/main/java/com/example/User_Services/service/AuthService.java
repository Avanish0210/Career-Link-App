package com.example.User_Services.service;

import com.example.User_Services.dto.LoginRequestDto;
import com.example.User_Services.dto.SignupRequestDto;
import com.example.User_Services.dto.UserDto;
import com.example.User_Services.entity.User;
import com.example.User_Services.event.UserCreatedEvent;
import com.example.User_Services.exceptions.BadRequestException;
import com.example.User_Services.exceptions.ResourceNotFoundException;
import com.example.User_Services.repository.UserRepository;
import com.example.User_Services.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final KafkaTemplate<Long, UserCreatedEvent> userCreatedEventKafkaTemplate;


    public UserDto signup(SignupRequestDto signupRequestDto) {
        boolean exist = userRepository.existsByEmail(signupRequestDto.getEmail());
        if(exist){
            throw new BadRequestException("Email already exists");
        }

        User user = modelMapper.map(signupRequestDto, User.class);
        user.setPassword(PasswordUtil.hasPassword(signupRequestDto.getPassword()));

        User saveUser = userRepository.save(user);
        UserCreatedEvent userCreatedEvent = UserCreatedEvent.builder()
                .userId(saveUser.getId())
                .name(saveUser.getName())
                .build();
        userCreatedEventKafkaTemplate.send("user_created_topic" , userCreatedEvent);
        return modelMapper.map(saveUser, UserDto.class);

    }

    public String login(LoginRequestDto loginRequestDto) {
        User user = userRepository.findByEmail(loginRequestDto.getEmail()).orElseThrow(()-> new ResourceNotFoundException("User not found"));
        boolean passwordMatch = PasswordUtil.checkPassword(loginRequestDto.getPassword() , user.getPassword());
        if(!passwordMatch){
            throw new BadRequestException("Wrong Password");
        }

        return jwtService.generateAccessToken(user);

    }
}

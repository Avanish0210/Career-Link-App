package com.example.Post_Services;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class PostServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(PostServicesApplication.class, args);
	}

}

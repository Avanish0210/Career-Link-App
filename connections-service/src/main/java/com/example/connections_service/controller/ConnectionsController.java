package com.example.connections_service.controller;

import com.example.connections_service.entity.Person;
import com.example.connections_service.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
public class ConnectionsController {

    private final ConnectionService connectionService;

    @GetMapping("/{userId}/first-degree")
    public ResponseEntity<List<Person>> getFirstConnection(@PathVariable Long userId) {
        return ResponseEntity.ok(connectionService.getFirstDegreeConnection(userId));
    }

}

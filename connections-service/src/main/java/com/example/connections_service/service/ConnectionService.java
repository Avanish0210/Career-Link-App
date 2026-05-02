package com.example.connections_service.service;

import com.example.connections_service.entity.Person;
import com.example.connections_service.repository.PersonsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectionService {
    private final PersonsRepository personsRepository;
    public List<Person> getFirstDegreeConnection(Long userId) {
        log.info("Getting first degree connections for user with id: {}", userId);
        return personsRepository.getFirstDegreeConnections(userId);
    }
}

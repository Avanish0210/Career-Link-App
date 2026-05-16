package com.example.connections_service.service;

import com.example.connections_service.entity.Person;
import com.example.connections_service.repository.PersonsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class PersonService {

    private final PersonsRepository personsRepository;

    public void createPerson(Long userId , String name){
        Person person = Person.builder().name(name).userId(userId).build();
        personsRepository.save(person);
    }
}

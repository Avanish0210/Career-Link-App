package com.example.connections_service.service;

import com.example.connections_service.auth.AuthContextHolder;
import com.example.connections_service.entity.Person;
import com.example.connections_service.exception.BadRequestException;
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

    public void sendConnectionRequest(Long receiverId) {
        Long senderId = AuthContextHolder.getCurrentUserId();
        log.info("sending connection request with senderId: {}, receiverId: {}", senderId, receiverId);

        if (senderId.equals(receiverId)) {
            throw new BadRequestException("Both sender and receiver are the same");
        }

        boolean alreadySentRequest = personsRepository.connectionRequestExists(senderId, receiverId);
        if (alreadySentRequest) {
            throw new BadRequestException("Connection request already exists, cannot send again");
        }

        boolean alreadyConnected = personsRepository.alreadyConnected(senderId, receiverId);
        if (alreadyConnected) {
            throw new BadRequestException("Already connected users, cannot add connection request");
        }

        personsRepository.addConnectionRequest(senderId, receiverId);
        log.info("Successfully sent the connection request");
    }

    public void acceptConnectionRequest(Long senderId) {
        Long receiverId = AuthContextHolder.getCurrentUserId();
        log.info("Accepting connection request with userId: {}, receiverId: {}", senderId, receiverId);

        if (senderId.equals(receiverId)) {
            throw new BadRequestException("Both sender and receiver are the same");
        }

        boolean alreadyConnected = personsRepository.alreadyConnected(senderId, receiverId);
        if (alreadyConnected) {
            throw new BadRequestException("Already connected users, cannot accept connection request again");
        }

        boolean alreadySentRequest = personsRepository.connectionRequestExists(senderId, receiverId);
        if (!alreadySentRequest) {
            throw new BadRequestException("No Connection request exists, cannot accept without request");
        }

        personsRepository.acceptConnectionRequest(senderId, receiverId);
        log.info("Successfully accepted the connection request");
    }

    public void rejectConnectionRequest(Long senderId) {
        Long receiverId = AuthContextHolder.getCurrentUserId();
        log.info("Rejecting a connection request with senderId: {}, receiverId: {}", senderId, receiverId);

        if (senderId.equals(receiverId)) {
            throw new BadRequestException("Both sender and receiver are the same");
        }

        boolean alreadySentRequest = personsRepository.connectionRequestExists(senderId, receiverId);
        if (!alreadySentRequest) {
            throw new BadRequestException("No Connection request exists, cannot reject it");
        }

        personsRepository.rejectConnectionRequest(senderId, receiverId);
        log.info("Successfully rejected the connection request");
    }
}

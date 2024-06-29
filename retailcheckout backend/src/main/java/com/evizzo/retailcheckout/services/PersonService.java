package com.evizzo.retailcheckout.services;

import com.evizzo.retailcheckout.entities.Person;
import com.evizzo.retailcheckout.repositories.PersonRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;

    public Optional<Person> findUserById(UUID userId){
        return personRepository.findById(userId);
    }
}

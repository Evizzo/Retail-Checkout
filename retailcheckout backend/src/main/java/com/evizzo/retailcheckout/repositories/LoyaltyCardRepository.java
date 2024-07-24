package com.evizzo.retailcheckout.repositories;

import com.evizzo.retailcheckout.entities.LoyaltyCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoyaltyCardRepository extends JpaRepository<LoyaltyCard, String> {
    Optional<LoyaltyCard> findByCode(String code);
}

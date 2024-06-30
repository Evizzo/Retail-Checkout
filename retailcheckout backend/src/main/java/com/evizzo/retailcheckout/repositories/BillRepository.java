package com.evizzo.retailcheckout.repositories;

import com.evizzo.retailcheckout.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BillRepository extends JpaRepository<Bill, UUID> {
    List<Bill> findByUserUserId(UUID userId);
}
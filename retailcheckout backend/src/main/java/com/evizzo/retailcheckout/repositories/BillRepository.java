package com.evizzo.retailcheckout.repositories;

import com.evizzo.retailcheckout.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BillRepository extends JpaRepository<Bill, UUID> {
    List<Bill> findByUserUserId(UUID userId);

    @Query("SELECT b FROM Bill b WHERE b.user.userId = :userId ORDER BY b.date DESC")
    List<Bill> findByUserUserIdSorted(@Param("userId") UUID userId);
}
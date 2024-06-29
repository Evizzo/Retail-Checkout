package com.evizzo.retailcheckout.repositories;

import com.evizzo.retailcheckout.entities.Token;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, UUID> {
    @Query("""
        select t from Token t inner join t.user u
        where u.userId = :userId and (t.expired = false or t.revoked = false)
       """)
    List<Token> findAllValidTokensByUser(UUID userId);


    Optional<Token> findByToken(String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM Token t WHERE t.user.userId = :userId")
    void deleteAllTokensByUserId(UUID userId);

}
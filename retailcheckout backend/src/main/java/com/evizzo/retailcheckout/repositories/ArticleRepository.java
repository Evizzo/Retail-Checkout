package com.evizzo.retailcheckout.repositories;

import com.evizzo.retailcheckout.entities.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {
    List<Article> findByBillId(UUID billId);
}

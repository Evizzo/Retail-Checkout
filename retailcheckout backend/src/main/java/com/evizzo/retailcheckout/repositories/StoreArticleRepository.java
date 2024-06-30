package com.evizzo.retailcheckout.repositories;

import com.evizzo.retailcheckout.entities.StoreArticle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreArticleRepository extends JpaRepository<StoreArticle, String> {
}

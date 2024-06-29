package com.evizzo.retailcheckout.services;

import com.evizzo.retailcheckout.entities.Article;
import com.evizzo.retailcheckout.repositories.ArticleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;

    public void saveArticles(List<Article> articles) {
        articleRepository.saveAll(articles);
    }
}
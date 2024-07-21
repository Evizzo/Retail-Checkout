package com.evizzo.retailcheckout.services;

import com.evizzo.retailcheckout.dtos.StoreArticleDTO;
import com.evizzo.retailcheckout.entities.StoreArticle;
import com.evizzo.retailcheckout.repositories.StoreArticleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class StoreArticleService {
    private final StoreArticleRepository storeArticleRepository;
    private final DtoService dtoService;

    public List<StoreArticleDTO> retrieveAllStoreArticles(){
        List<StoreArticle> storeArticles = storeArticleRepository.findAll();

        return storeArticles.stream()
                .map(dtoService::convertToDto)
                .collect(Collectors.toList());
    }

    public void saveArticle(StoreArticle storeArticle) {
        storeArticleRepository.save(storeArticle);
    }

    public Optional<StoreArticleDTO> retrieveStoreArticleBySerialNumber(String serialNumber) {
        return storeArticleRepository.findById(serialNumber)
                .map(dtoService::convertToDto);
    }
}

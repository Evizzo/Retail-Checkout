package com.evizzo.retailcheckout.controllers;

import com.evizzo.retailcheckout.dtos.StoreArticleDTO;
import com.evizzo.retailcheckout.services.StoreArticleService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("store-articles")
public class StoreArticleController {
    private final StoreArticleService storeArticleService;

    @PreAuthorize("hasAuthority('cashier:read')")
    @GetMapping
    public ResponseEntity<List<StoreArticleDTO>> retrieveCashierBills(){
        return ResponseEntity.ok(storeArticleService.retrieveAllStoreArticles());
    }
}

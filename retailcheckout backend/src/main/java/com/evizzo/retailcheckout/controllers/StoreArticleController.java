package com.evizzo.retailcheckout.controllers;

import com.evizzo.retailcheckout.dtos.StoreArticleDTO;
import com.evizzo.retailcheckout.services.StoreArticleService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for handling requests related to store articles.
 */
@RestController
@AllArgsConstructor
@RequestMapping("store-articles")
public class StoreArticleController {
    private final StoreArticleService storeArticleService;

    /**
     * Retrieves all store articles.
     *
     * @return ResponseEntity containing a list of StoreArticleDTOs.
     */
    @PreAuthorize("hasAuthority('cashier:read')")
    @GetMapping
    public ResponseEntity<List<StoreArticleDTO>> retrieveCashierBills(){
        return ResponseEntity.ok(storeArticleService.retrieveAllStoreArticles());
    }

    /**
     * Retrieves a store article by its serial number.
     *
     * @param serialNumber The serial number of the store article.
     * @return ResponseEntity containing the StoreArticleDTO if found, or a 404 Not Found status if not found.
     */
    @PreAuthorize("hasAuthority('cashier:read')")
    @GetMapping("/{serialNumber}")
    public ResponseEntity<StoreArticleDTO> retrieveStoreArticleBySerialNumber(@PathVariable String serialNumber) {
        return storeArticleService.retrieveStoreArticleBySerialNumber(serialNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

package com.evizzo.retailcheckout.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID articleId;

    private Integer quantity;

    private Double fullPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_article_serial_number", referencedColumnName = "serialNumber")
    private StoreArticle storeArticle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id")
    private Bill bill;
}
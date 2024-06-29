package com.evizzo.retailcheckout.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDTO {
    private UUID articleId;
    private String serialNumber;
    private String articleName;
    private Integer quantity;
    private Double pricePerItem;
    private Double fullPrice;
    private UUID billId;
}
package com.evizzo.retailcheckout.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreArticleDTO {
    private String serialNumber;
    private String articleName;
    private Double price;
    private Integer quantityAvailable;
}

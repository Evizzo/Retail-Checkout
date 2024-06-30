package com.evizzo.retailcheckout.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class StoreArticle {
    @Id
    private String serialNumber;

    private String articleName;

    private Double price;

    private Integer quantityAvailable;

    @OneToMany(mappedBy = "storeArticle", cascade = CascadeType.ALL)
    private List<Article> articles;
}

package com.evizzo.retailcheckout.entities;

import jakarta.persistence.*;
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

    @Column(unique = true)
    private String articleName;

    private Double price;

    private Integer quantityAvailable;

    @OneToMany(mappedBy = "storeArticle", cascade = CascadeType.ALL)
    private List<Article> articles;
}

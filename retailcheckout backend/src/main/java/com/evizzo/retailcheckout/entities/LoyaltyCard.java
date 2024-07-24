package com.evizzo.retailcheckout.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class LoyaltyCard {
    @Id
    private String jmbg;

    @Column(unique = true)
    private String code;

    private String firstname;

    private String lastname;

    @Column(unique = true)
    private String phonenumber;

    private Double points;
}

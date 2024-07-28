package com.evizzo.retailcheckout.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyCardDTO {
    private String jmbg;
    private String firstname;
    private String lastname;
    private String phonenumber;
    private double points;
}

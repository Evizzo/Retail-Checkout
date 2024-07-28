package com.evizzo.retailcheckout.dtos;

import com.evizzo.retailcheckout.enums.PaymentOptions;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillDTO {
    private UUID id;
    private LocalDateTime date;
    private PaymentOptions paidBy;
    private double totalPrice;
    private double changeGiven;
    private double amountGivenToCashier;
    private double paidWithPoints;
    private double cashAmount;
    private double cardAmount;
    private String codeUsed;
    private double refundedAmount;
    private List<ArticleDTO> articles;
    private UUID userId;
}

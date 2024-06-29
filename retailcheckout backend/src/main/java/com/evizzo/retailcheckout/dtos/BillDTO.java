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
    private List<ArticleDTO> articles;
    private UUID userId;
}

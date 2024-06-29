package com.evizzo.retailcheckout.entities;

import com.evizzo.retailcheckout.enums.PaymentOptions;
import jakarta.persistence.*;
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
@Entity
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private PaymentOptions paidBy;

    @OneToMany(mappedBy = "bill")
    private List<Article> articles;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Person user;
}
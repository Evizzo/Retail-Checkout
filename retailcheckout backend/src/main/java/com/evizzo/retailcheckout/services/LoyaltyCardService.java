package com.evizzo.retailcheckout.services;

import com.evizzo.retailcheckout.entities.LoyaltyCard;
import com.evizzo.retailcheckout.repositories.LoyaltyCardRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class LoyaltyCardService {
    private final LoyaltyCardRepository loyaltyCardRepository;

    public double getAvailablePoints(String code) {
        Optional<LoyaltyCard> optionalCard = loyaltyCardRepository.findByCode(code);
        if (optionalCard.isEmpty()) {
            return 0;
        }

        LoyaltyCard card = optionalCard.get();
        return card.getPoints();
    }

    public double redeemPoints(String code, double pointsToRedeem, double totalBillPrice) {
        Optional<LoyaltyCard> optionalCard = loyaltyCardRepository.findByCode(code);
        if (optionalCard.isEmpty()) {
            return 0;
        }

        LoyaltyCard card = optionalCard.get();
        double availablePoints = card.getPoints();

        if (pointsToRedeem % 200 != 0 || pointsToRedeem <= 0) {
            return 0;
        }

        double maxRedeemablePoints = Math.floor(availablePoints / 200) * 200;
        if (pointsToRedeem > maxRedeemablePoints) {
            return 0;
        }

        double redeemableValue = (pointsToRedeem / 200) * 15;

        double finalValue = Math.min(redeemableValue, totalBillPrice);

        double pointsToDeduct = Math.ceil((finalValue / 15) * 200);

        if (pointsToDeduct > availablePoints) {
            pointsToDeduct = availablePoints;
        }

        card.setPoints(availablePoints - pointsToDeduct);
        loyaltyCardRepository.save(card);

        return finalValue;
    }
}

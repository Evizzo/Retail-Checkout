package com.evizzo.retailcheckout.controllers;

import com.evizzo.retailcheckout.services.LoyaltyCardService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("loyalty-card")
public class LoyaltyCardController {
    private final LoyaltyCardService loyaltyCardService;

    /**
     * Redeems points from a loyalty card.
     *
     * @param code The loyalty card code.
     * @param pointsToRedeem The number of points to redeem.
     * @param totalBillPrice The total price of the bill.
     * @return The value of the redeemed points in dollars.
     */
    @PreAuthorize("hasAuthority('cashier:update')")
    @PutMapping("/redeem")
    public double redeemPoints(@RequestParam String code, @RequestParam double pointsToRedeem, @RequestParam double totalBillPrice) {
        return loyaltyCardService.redeemPoints(code, pointsToRedeem, totalBillPrice);
    }

    /**
     * Gets the available points on a loyalty card.
     *
     * @param code The loyalty card code.
     * @return The number of available points on the card.
     */
    @PreAuthorize("hasAuthority('cashier:read')")
    @GetMapping("/points")
    public double getAvailablePoints(@RequestParam String code) {
        return loyaltyCardService.getAvailablePoints(code);
    }
}

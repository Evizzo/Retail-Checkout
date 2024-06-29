package com.evizzo.retailcheckout.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
    CASHIER_READ("cashier:read"),
    CASHIER_UPDATE("cashier:update"),
    CASHIER_CREATE("cashier:create"),
    CASHIER_DELETE("cashier:delete");

    @Getter
    private final String permission;
}

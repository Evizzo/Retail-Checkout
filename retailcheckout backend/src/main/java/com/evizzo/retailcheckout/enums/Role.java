package com.evizzo.retailcheckout.enums;

import com.evizzo.retailcheckout.config.Permission;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.evizzo.retailcheckout.config.Permission.*;

@RequiredArgsConstructor
public enum Role {
    CASHIER(
            Set.of(
                    CASHIER_READ,
                    CASHIER_UPDATE,
                    CASHIER_DELETE,
                    CASHIER_CREATE
            )
    );

    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
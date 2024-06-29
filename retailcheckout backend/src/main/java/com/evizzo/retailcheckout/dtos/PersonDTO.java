package com.evizzo.retailcheckout.dtos;

import com.evizzo.retailcheckout.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonDTO {
    private UUID id;
    private String username;
    private Role role;
}
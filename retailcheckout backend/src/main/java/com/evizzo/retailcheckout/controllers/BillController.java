package com.evizzo.retailcheckout.controllers;

import com.evizzo.retailcheckout.dtos.BillDTO;
import com.evizzo.retailcheckout.entities.Bill;
import com.evizzo.retailcheckout.services.BillService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("bill")
public class BillController {
    private final BillService billService;

    @Transactional
    @PreAuthorize("hasAuthority('cashier:create')")
    @PostMapping
    public ResponseEntity<BillDTO> saveBill(@Valid @RequestBody Bill bill, HttpServletRequest request){
        return ResponseEntity.ok(billService.saveBill(bill, request));
    }

    @PreAuthorize("hasAuthority('cashier:read')")
    @GetMapping
    public ResponseEntity<List<BillDTO>> retrieveCashierBills(HttpServletRequest request){
        return ResponseEntity.ok(billService.findBillsByUserId(request));
    }

    @PreAuthorize("hasAuthority('cashier:read')")
    @GetMapping("/{billId}")
    public ResponseEntity<BillDTO> findBillById(@PathVariable UUID billId, HttpServletRequest request) {
        return billService.findBillById(billId, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
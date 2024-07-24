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

/**
 * Controller for handling requests related to bills in the retail checkout system.
 */
@RestController
@AllArgsConstructor
@RequestMapping("bill")
public class BillController {
    private final BillService billService;

    /**
     * Saves a new bill.
     *
     * @param bill The bill to be saved, must be valid.
     * @param request The HTTP request associated with this operation.
     * @param code Optional code parameter for additional operations.
     * @return ResponseEntity containing the saved BillDTO.
     */
    @Transactional
    @PreAuthorize("hasAuthority('cashier:create')")
    @PostMapping
    public ResponseEntity<BillDTO> saveBill(@Valid @RequestBody Bill bill, HttpServletRequest request,
                                            @RequestParam(value = "code", required = false) String code){
        return ResponseEntity.ok(billService.saveBill(bill, request, code));
    }

    /**
     * Retrieves all bills associated with the current user.
     *
     * @param request The HTTP request associated with this operation.
     * @return ResponseEntity containing a list of BillDTOs.
     */
    @PreAuthorize("hasAuthority('cashier:read')")
    @GetMapping
    public ResponseEntity<List<BillDTO>> retrieveCashierBills(HttpServletRequest request){
        return ResponseEntity.ok(billService.findBillsByUserId(request));
    }

    /**
     * Retrieves a specific bill by its ID.
     *
     * @param billId The ID of the bill to retrieve.
     * @param request The HTTP request associated with this operation.
     * @return ResponseEntity containing the BillDTO if found, or a 404 Not Found status if not found.
     */
    @PreAuthorize("hasAuthority('cashier:read')")
    @GetMapping("/{billId}")
    public ResponseEntity<BillDTO> findBillById(@PathVariable UUID billId, HttpServletRequest request) {
        return billService.findBillById(billId, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
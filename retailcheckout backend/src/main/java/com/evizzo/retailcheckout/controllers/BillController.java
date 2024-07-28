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

    /**
     * Refunds a specific article from a bill.
     *
     * @param billId The ID of the bill containing the article.
     * @param articleId The ID of the article to be refunded.
     * @param request The HTTP request associated with this operation.
     * @return ResponseEntity containing the updated BillDTO after the refund.
     */
    @Transactional
    @PreAuthorize("hasAuthority('cashier:refund')")
    @DeleteMapping("/{billId}/article/{articleId}")
    public ResponseEntity<BillDTO> refundArticle(@PathVariable UUID billId, @PathVariable UUID articleId, HttpServletRequest request) {
        return ResponseEntity.ok(billService.refundArticle(billId, articleId, request));
    }

    /**
     * Cancels a bill, removing it and restocking articles if necessary.
     *
     * @param billId The ID of the bill to be canceled.
     * @param request The HTTP request associated with this operation.
     * @return ResponseEntity with no content if the cancellation was successful.
     */
    @Transactional
    @PreAuthorize("hasAuthority('cashier:delete')")
    @DeleteMapping("/{billId}")
    public ResponseEntity<Void> cancelBill(@PathVariable UUID billId, HttpServletRequest request) {
        billService.cancelBill(billId, request);
        return ResponseEntity.noContent().build();
    }
}
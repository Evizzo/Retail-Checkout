package com.evizzo.retailcheckout.services;

import com.evizzo.retailcheckout.config.JwtService;
import com.evizzo.retailcheckout.dtos.BillDTO;
import com.evizzo.retailcheckout.entities.*;
import com.evizzo.retailcheckout.enums.PaymentOptions;
import com.evizzo.retailcheckout.exceptions.UserNotFoundException;
import com.evizzo.retailcheckout.repositories.BillRepository;
import com.evizzo.retailcheckout.repositories.LoyaltyCardRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BillService {
    private final BillRepository billRepository;
    private final JwtService jwtService;
    private final PersonService personService;
    private final DtoService dtoService;
    private final ArticleService articleService;
    private final StoreArticleService storeArticleService;
    private final LoyaltyCardRepository loyaltyCardRepository;

    public BillDTO saveBill(Bill bill, HttpServletRequest request, String code){
        UUID userId = jwtService.extractUserIdFromToken(request);
        Person user = personService.findUserById(userId).orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        bill.setUser(user);
        bill.setDate(LocalDateTime.now());
        bill.setTotalPrice(bill.getTotalPrice() + bill.getPaidWithPoints());
        bill.setRefundedAmount(0);

        if (bill.getPaidBy() == PaymentOptions.CARD){
            bill.setChangeGiven(0.0);
            bill.setAmountGivenToCashier(bill.getTotalPrice() - bill.getPaidWithPoints());
        } else if (bill.getPaidBy() == PaymentOptions.CASH){
            bill.setChangeGiven(bill.getAmountGivenToCashier() - bill.getTotalPrice() + bill.getPaidWithPoints());
        } else {
            bill.setChangeGiven(bill.getAmountGivenToCashier() - (bill.getTotalPrice() - bill.getCardAmount()) + bill.getPaidWithPoints());
        }

        if (code != null && !code.isEmpty()) {
            Optional<LoyaltyCard> optionalCard = loyaltyCardRepository.findByCode(code);
            if (optionalCard.isPresent()) {
                LoyaltyCard card = optionalCard.get();
                card.setPoints(card.getPoints() + bill.getTotalPrice());
                bill.setCodeUsed(code);
                loyaltyCardRepository.save(card);
            }
        }

        Bill savedBill = billRepository.save(bill);

        List<Article> articles = bill.getArticles();
        for (Article article : articles) {
            article.setFullPrice(article.getQuantity() * article.getStoreArticle().getPrice());
            article.setBill(savedBill);

            StoreArticle storeArticle = article.getStoreArticle();
            int newQuantityAvailable = storeArticle.getQuantityAvailable() - article.getQuantity();
            if (newQuantityAvailable < 0) {
                throw new IllegalArgumentException("Insufficient stock for Article ID: " + article.getArticleId());
            }
            storeArticle.setQuantityAvailable(newQuantityAvailable);

            storeArticleService.saveArticle(storeArticle);
        }

        articleService.saveArticles(bill.getArticles());

        return dtoService.convertToDto(savedBill);
    }

    public List<BillDTO> findBillsByUserId(HttpServletRequest request){
        UUID userId = jwtService.extractUserIdFromToken(request);
        List<Bill> bills = billRepository.findByUserUserIdSorted(userId);

        return bills.stream()
                .map(dtoService::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<BillDTO> findBillById(UUID billId, HttpServletRequest request) {
        Optional<Bill> billOptional = billRepository.findById(billId);

        if (billOptional.isEmpty()) {
            throw new RuntimeException("Bill not found with ID: " + billId);
        }

        UUID userId = jwtService.extractUserIdFromToken(request);
        Bill bill = billOptional.get();
        UUID billUserId = bill.getUser().getUserId();

        if (!billUserId.equals(userId)) {
            throw new RuntimeException("User does not have permission to access this bill");
        }

        return Optional.of(dtoService.convertToDto(bill));
    }

    public BillDTO refundArticle(UUID billId, UUID articleId, HttpServletRequest request) {
        UUID userId = jwtService.extractUserIdFromToken(request);
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found with ID: " + billId));

        if (!bill.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("User does not have permission to access this bill");
        }

        Article article = bill.getArticles().stream()
                .filter(a -> a.getArticleId().equals(articleId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Article not found with ID: " + articleId));

        double refundAmount = article.getFullPrice();
        bill.setTotalPrice(bill.getTotalPrice() - refundAmount);
        bill.getArticles().remove(article);
        StoreArticle storeArticle = article.getStoreArticle();
        storeArticle.setQuantityAvailable(storeArticle.getQuantityAvailable() + article.getQuantity());

        bill.setRefundedAmount(bill.getRefundedAmount() + refundAmount);

        storeArticleService.saveArticle(storeArticle);
        articleService.deleteArticle(article);
        billRepository.save(bill);

        return dtoService.convertToDto(bill);
    }

    public void cancelBill(UUID billId, HttpServletRequest request) {
        UUID userId = jwtService.extractUserIdFromToken(request);
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found with ID: " + billId));

        if (!bill.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("User does not have permission to access this bill");
        }

        for (Article article : bill.getArticles()) {
            StoreArticle storeArticle = article.getStoreArticle();
            storeArticle.setQuantityAvailable(storeArticle.getQuantityAvailable() + article.getQuantity());
            storeArticleService.saveArticle(storeArticle);
        }

        for (Article article : bill.getArticles()) {
            articleService.deleteArticle(article);
        }

        billRepository.delete(bill);
    }
}
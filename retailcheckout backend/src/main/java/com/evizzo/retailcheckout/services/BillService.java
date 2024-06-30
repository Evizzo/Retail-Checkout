package com.evizzo.retailcheckout.services;

import com.evizzo.retailcheckout.config.JwtService;
import com.evizzo.retailcheckout.dtos.BillDTO;
import com.evizzo.retailcheckout.entities.Article;
import com.evizzo.retailcheckout.entities.Bill;
import com.evizzo.retailcheckout.entities.Person;
import com.evizzo.retailcheckout.entities.StoreArticle;
import com.evizzo.retailcheckout.enums.PaymentOptions;
import com.evizzo.retailcheckout.exceptions.UserNotFoundException;
import com.evizzo.retailcheckout.repositories.BillRepository;
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

    public BillDTO saveBill(Bill bill, HttpServletRequest request){
        UUID userId = jwtService.extractUserIdFromToken(request);
        Person user = personService.findUserById(userId).orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        bill.setUser(user);
        bill.setDate(LocalDateTime.now());

        if (bill.getPaidBy() == PaymentOptions.CARD){
            bill.setChangeGiven(0.0);
            bill.setAmountGivenToCashier(bill.getTotalPrice());
        } else {
            bill.setChangeGiven(bill.getAmountGivenToCashier() - bill.getTotalPrice());
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

        List<Bill> bills = billRepository.findByUserUserId(userId);
        return bills.stream()
                .map(dtoService::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<BillDTO> findBillById(UUID billId){
        Optional<Bill> billOptional = billRepository.findById(billId);

        return billOptional.map(dtoService::convertToDto);
    }
}
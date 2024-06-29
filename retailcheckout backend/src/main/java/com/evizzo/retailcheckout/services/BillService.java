package com.evizzo.retailcheckout.services;

import com.evizzo.retailcheckout.config.JwtService;
import com.evizzo.retailcheckout.dtos.BillDTO;
import com.evizzo.retailcheckout.entities.Article;
import com.evizzo.retailcheckout.entities.Bill;
import com.evizzo.retailcheckout.entities.Person;
import com.evizzo.retailcheckout.exceptions.UserNotFoundException;
import com.evizzo.retailcheckout.repositories.BillRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    public BillDTO saveBill(Bill bill, HttpServletRequest request){
        UUID userId = jwtService.extractUserIdFromToken(request);
        Person user = personService.findUserById(userId).orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        bill.setUser(user);
        bill.setDate(LocalDateTime.now());

        Bill savedBill = billRepository.save(bill);

        List<Article> articles = bill.getArticles();
        for (Article article : articles) {
            article.setBill(savedBill);
        }

        articleService.saveArticles(bill.getArticles());

        return dtoService.convertToDto(savedBill);
    }

    public List<BillDTO> findBillsByUserId(UUID userId){
        List<Bill> bills = billRepository.findByUserUserId(userId);
        return bills.stream()
                .map(dtoService::convertToDto)
                .collect(Collectors.toList());
    }
}
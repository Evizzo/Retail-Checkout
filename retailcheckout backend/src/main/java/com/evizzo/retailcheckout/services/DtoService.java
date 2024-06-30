package com.evizzo.retailcheckout.services;

import com.evizzo.retailcheckout.dtos.ArticleDTO;
import com.evizzo.retailcheckout.dtos.BillDTO;
import com.evizzo.retailcheckout.dtos.PersonDTO;
import com.evizzo.retailcheckout.dtos.StoreArticleDTO;
import com.evizzo.retailcheckout.entities.Article;
import com.evizzo.retailcheckout.entities.Bill;
import com.evizzo.retailcheckout.entities.Person;
import com.evizzo.retailcheckout.entities.StoreArticle;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DtoService {
    public ArticleDTO convertToDto(Article article) {
        return ArticleDTO.builder()
                .articleId(article.getArticleId())
                .quantity(article.getQuantity())
                .fullPrice(article.getFullPrice())
                .articleName(article.getStoreArticle().getArticleName())
                .pricePerItem(article.getStoreArticle().getPrice())
                .billId(article.getBill() != null ? article.getBill().getId() : null)
                .build();
    }

    public BillDTO convertToDto(Bill bill) {
        List<ArticleDTO> articleDTOs = bill.getArticles().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return BillDTO.builder()
                .id(bill.getId())
                .date(bill.getDate())
                .paidBy(bill.getPaidBy())
                .articles(articleDTOs)
                .changeGiven(bill.getChangeGiven())
                .totalPrice(bill.getTotalPrice())
                .amountGivenToCashier(bill.getAmountGivenToCashier())
                .userId(bill.getUser() != null ? bill.getUser().getUserId() : null)
                .build();
    }

    public StoreArticleDTO convertToDto(StoreArticle storeArticle) {
        return StoreArticleDTO.builder()
                .serialNumber(storeArticle.getSerialNumber())
                .articleName(storeArticle.getArticleName())
                .price(storeArticle.getPrice())
                .quantityAvailable(storeArticle.getQuantityAvailable())
                .build();
    }

    public PersonDTO convertToDto(Person person) {
        return PersonDTO.builder()
                .id(person.getUserId())
                .username(person.getUsername())
                .role(person.getRole())
                .build();
    }
}

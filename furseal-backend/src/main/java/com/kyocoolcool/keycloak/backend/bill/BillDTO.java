package com.kyocoolcool.keycloak.backend.bill;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.product.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class BillDTO {
    private Long billId;

    private Product product;

    private String productName;

    private Integer memberCount;

    private Integer money;

    private String gainer;

    private String buyer;

    private String toMoney;

    private Character way;

    private Integer status;

//    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private LocalDateTime gainTime;

//    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private LocalDateTime transactionTime;

    private Boolean deleted;

    private Integer tax;

    private Integer fee;

    private Integer toMoneyTax;

    private Double averageSalary;

    private List<Member> members;

    public BillDTO(Long billId, String productName, Integer money, String buyer, LocalDateTime transactionTime, Boolean deleted, Integer tax, Integer fee, Long toMoney,Integer toMoneyTax) {
        this.billId = billId;
        this.productName = productName;
        this.money = money;
        this.buyer = buyer;
        this.transactionTime = transactionTime;
        this.deleted = deleted;
        this.tax = tax;
        this.fee = fee;
        this.toMoneyTax = toMoneyTax;
    }
}
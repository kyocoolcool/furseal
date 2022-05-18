package com.kyocoolcool.keycloak.backend.bill;

import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.product.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
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

    private Instant gainTime;

    private Instant transactionTime;

    private Boolean deleted;

    private Integer tax;

    private Integer fee;

    private Integer toMoneyTax;

    private Double averageSalary;

    private List<Member> members;

    public BillDTO(Long billId, String productName, Integer money, String buyer, Instant transactionTime, Boolean deleted, Integer tax, Integer fee, Integer toMoneyTax) {
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
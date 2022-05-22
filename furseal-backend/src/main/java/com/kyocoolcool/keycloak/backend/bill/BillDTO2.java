package com.kyocoolcool.keycloak.backend.bill;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.product.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class BillDTO2 {
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

    private String gainTime;

    private String transactionTime;

    private Boolean deleted;

    private Integer tax;

    private Integer fee;

    private Integer toMoneyTax;

    private Double averageSalary;

    private List<Member> members;

    public BillDTO2(Long billId, String productName, Integer money, String buyer, String transactionTime, Boolean deleted, Integer tax, Integer fee, Integer toMoneyTax) {
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
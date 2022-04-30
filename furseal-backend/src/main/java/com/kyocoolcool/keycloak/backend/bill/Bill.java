package com.kyocoolcool.keycloak.backend.bill;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.product.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
public class Bill implements Serializable {
    @Id
//    @SequenceGenerator(name = "billSeq", sequenceName = "bill_id", allocationSize = 1, initialValue = 1)
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "billSeq")
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "bill_id", nullable = false)
    private Long billId;

    @Column(name = "money")
    private Integer money;

    @Column(name = "buyer")
    private Long buyer;

    @Column(name = "gainer")
    private Long gainer;

    @Column(name = "way")
    private Character way;

    @Column(name = "status")
    private Integer status;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "gain_time")
    private Instant gainTime;

    @Column(name = "transaction_time")
    private Instant transactionTime;

    @Column(name = "tax")
    private Integer tax;

    @Column(name = "fee")
    private Integer fee;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(
            name = "product_id",
            referencedColumnName = "product_Id")
    @JsonIgnore
    private Product product;

    @ManyToMany(cascade = CascadeType.ALL,fetch=FetchType.EAGER)
    @JoinTable(name = "bill_member",
            joinColumns = @JoinColumn(name = "bill_id", referencedColumnName = "bill_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id",
                    referencedColumnName = "member_id"))
    @JsonIgnore
    private List<Member> members;

    public Bill(Long billId, Integer money, Long buyer, Long gainer, Character way, Integer status, Boolean deleted, Instant gainTime, Instant transactionTime, Product product) {
        this.billId = billId;
        this.money = money;
        this.buyer = buyer;
        this.gainer = gainer;
        this.way = way;
        this.status = status;
        this.deleted = deleted;
        this.gainTime = gainTime;
        this.transactionTime = transactionTime;
        this.product = product;
    }

    public Bill(Long billId, Integer money, Long buyer, Long gainer, Character way, Integer status, Boolean deleted, Instant gainTime, Instant transactionTime) {
        this.billId = billId;
        this.money = money;
        this.buyer = buyer;
        this.gainer = gainer;
        this.way = way;
        this.status = status;
        this.deleted = deleted;
        this.gainTime = gainTime;
        this.transactionTime = transactionTime;
    }

    @Override
    public String toString() {
        return "Bill{" +
                "billId=" + billId +
                ", money=" + money +
                ", buyer=" + buyer +
                ", gainer=" + gainer +
                ", way=" + way +
                ", status=" + status +
                ", deleted=" + deleted +
                ", gainTime=" + gainTime +
                ", transactionTime=" + transactionTime +
                ", tax=" + tax +
                ", fee=" + fee +
                '}';
    }
}

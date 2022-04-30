package com.kyocoolcool.keycloak.backend.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kyocoolcool.keycloak.backend.bill.Bill;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @Column(name = "product_id", nullable = false)
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(name = "name", length = 20)
    private String name;

    @Column(name = "price")
    private Integer price;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Bill> bills;

    public Product(Long productId, String name, Integer price) {
        this.productId = productId;
        this.name = name;
        this.price = price;
    }
}
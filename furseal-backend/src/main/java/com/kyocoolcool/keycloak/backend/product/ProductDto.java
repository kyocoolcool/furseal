package com.kyocoolcool.keycloak.backend.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kyocoolcool.keycloak.backend.bill.Bill;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {

    private Long productId;

    private String name;

    private Integer price;

    private String level;

    private Boolean deleted;
}
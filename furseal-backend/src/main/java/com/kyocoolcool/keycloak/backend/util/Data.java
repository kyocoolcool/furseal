package com.kyocoolcool.keycloak.backend.util;

import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.product.Product;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Getter
@Setter
@ToString
public class Data {
    private Map<Long, Member> members;
    private Map<String, Member> membersByString;
    private Map<String, Product> productsByString;

}

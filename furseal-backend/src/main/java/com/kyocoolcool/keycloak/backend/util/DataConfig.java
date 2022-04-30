package com.kyocoolcool.keycloak.backend.util;

import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.member.MemberRepository;
import com.kyocoolcool.keycloak.backend.product.Product;
import com.kyocoolcool.keycloak.backend.product.ProductRepository;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@Getter
@Setter
public class DataConfig {
    @Autowired
    MemberRepository memberRepository;
    @Autowired
    ProductRepository productRepository;

    private Map<Integer, Member> memberMap;

    @Bean
    public Data data() {
        List<Member> members = memberRepository.findAll();
        List<Product> products = productRepository.findAll();
        Data data = new Data();
        Map<Long, Member> memberMap = members.stream().collect(Collectors.toMap(Member::getMemberId, x ->x));
        data.setMembers(memberMap);
        Map<String, Member> memberMapByString = members.stream().collect(Collectors.toMap(Member::getName, x ->x));
        data.setMembersByString(memberMapByString);
        Map<String, Product> productMapByString = products.stream().collect(Collectors.toMap(Product::getName, x ->x));
        data.setProductsByString(productMapByString);
        return data;
    }
}

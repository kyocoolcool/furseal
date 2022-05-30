package com.kyocoolcool.keycloak.backend.bill;

import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.member.MemberRepository;
import com.kyocoolcool.keycloak.backend.product.Product;
import com.kyocoolcool.keycloak.backend.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class BillService {
    @Autowired
    MemberRepository memberRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    BillRepository billRepository;
    public List<Bill> getBills() {
        List<Bill> result =
                StreamSupport.stream( billRepository.findAll().spliterator() , false)
                        .collect(Collectors.toList());
        return result;
    }

    public List<Bill> getBillsByDate(LocalDateTime fromDateInstant, LocalDateTime toDateInstant) {
        List<Bill> result =
                StreamSupport.stream( billRepository.findAllByTransactionTimeBetweenAndDeletedIsFalse(fromDateInstant, toDateInstant).spliterator() , false)
                        .collect(Collectors.toList());
        return result;
    }

    public List<Bill> getBillsByDateAndStatus(LocalDateTime fromDateInstant, LocalDateTime toDateInstant, Integer status) {
        List<Bill> result =
                StreamSupport.stream( billRepository.findAllByTransactionTimeBetweenAndDeletedIsFalseAndStatusIs(fromDateInstant, toDateInstant, status).spliterator() , false)
                        .collect(Collectors.toList());
        return result;
    }

    public Map<Long, Member> getMembers() {
        List<Member> members = memberRepository.findAll();
        Map<Long, Member> memberMap = members.stream().collect(Collectors.toMap(Member::getMemberId, x ->x));
        return memberMap;
    }

    public Map<String, Member> getMembersByString() {
        List<Member> members = memberRepository.findAll();
        Map<String, Member> memberMapByString = members.stream().collect(Collectors.toMap(Member::getName, x ->x));
        return memberMapByString;
    }

    public Map<String, Product> getProductsByString() {
        List<Product> products = productRepository.findAll();
        Map<String, Product> productMapByString = products.stream().collect(Collectors.toMap(Product::getName, x ->x));
        return productMapByString;
    }
}

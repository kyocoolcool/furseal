package com.kyocoolcool.keycloak.backend.product;
import com.kyocoolcool.keycloak.backend.bill.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByDeletedIs(Boolean deleted);
    List<Product> findProductsByName(String name);
}

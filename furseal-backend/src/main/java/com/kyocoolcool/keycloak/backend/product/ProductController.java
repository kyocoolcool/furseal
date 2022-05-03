package com.kyocoolcool.keycloak.backend.product;

import com.kyocoolcool.keycloak.backend.bill.Bill;
import com.kyocoolcool.keycloak.backend.bill.BillDTO;
import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.movie.Movie;
import com.kyocoolcool.keycloak.backend.util.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@Slf4j
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    Data data;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping()
    public List<Product> getAllProducts() {
        return productRepository.findAllByDeletedIs(false);
    }

    @PostMapping()
    public Product createProduct(@RequestBody Product product) {
        product.setDeleted(false);
        return productRepository.save(product);
    }

    @GetMapping("{productId}")
    public ResponseEntity<Product> getProduct(@PathVariable Long productId) {
        Optional<Product> productOptional = productRepository.findById(productId);
        return new ResponseEntity<Product>(productOptional.orElse(null), HttpStatus.OK);
    }

    @PutMapping("{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long productId,@RequestBody ProductDto productDto) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Product product = optionalProduct.get();
        product.setLevel(productDto.getLevel());
        product.setPrice(productDto.getPrice());
        product.setName(productDto.getName());
        return new ResponseEntity<Product>(productRepository.save(product), HttpStatus.OK);
    }

    @DeleteMapping("{billId}")
    public Product deleteProduct(@PathVariable Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Product product = optionalProduct.get();
        product.setDeleted(true);
        return productRepository.save(product);
    }

    @GetMapping("level")
    public List<String> getAllProductLevel() {
        Map<String, String> productLevel = data.getProductLevel();
        List<String> productLevelList = new ArrayList<>(productLevel.values());
        return productLevelList;
    }
}

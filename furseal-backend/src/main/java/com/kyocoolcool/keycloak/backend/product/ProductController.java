package com.kyocoolcool.keycloak.backend.product;

import com.kyocoolcool.keycloak.backend.movie.Movie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@Slf4j
@RequestMapping("products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping()
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PutMapping()
    public Product saveProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}

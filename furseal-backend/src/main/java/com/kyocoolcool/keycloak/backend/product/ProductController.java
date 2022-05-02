package com.kyocoolcool.keycloak.backend.product;

import com.kyocoolcool.keycloak.backend.bill.Bill;
import com.kyocoolcool.keycloak.backend.bill.BillDTO;
import com.kyocoolcool.keycloak.backend.movie.Movie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@Slf4j
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping()
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PutMapping()
    public Product updateProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PostMapping()
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("{productId}")
    public ResponseEntity<Product> getProduct(@PathVariable Long productId) {
        Optional<Product> productOptional = productRepository.findById(productId);
        return new ResponseEntity<Product>(productOptional.orElse(null), HttpStatus.OK);
    }

//    @PutMapping("{billId}")
//    public Bill updateBill(@RequestBody BillDTO billDTO) {
//        log.info(billDTO.toString());
//        Bill bill = new Bill();
//        BeanUtils.copyProperties(billDTO, bill);
//        bill.setBuyer(data.getMembersByString().get(billDTO.getBuyer()).getMemberId());
//        bill.setGainer(data.getMembersByString().get(billDTO.getGainer()).getMemberId());
//        bill.setProduct(data.getProductsByString().get(billDTO.getProductName()));
//        log.info(bill.toString());
//        return billRepository.save(bill);
//    }
}

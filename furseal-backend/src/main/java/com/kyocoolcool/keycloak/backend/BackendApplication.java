package com.kyocoolcool.keycloak.backend;

import com.kyocoolcool.keycloak.backend.bill.BillRepository;
import com.kyocoolcool.keycloak.backend.member.MemberRepository;
import com.kyocoolcool.keycloak.backend.product.ProductRepository;
import com.kyocoolcool.keycloak.backend.storage.StorageProperties;
import com.kyocoolcool.keycloak.backend.util.DataTransfer;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Log4j2
@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class BackendApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
    }


}

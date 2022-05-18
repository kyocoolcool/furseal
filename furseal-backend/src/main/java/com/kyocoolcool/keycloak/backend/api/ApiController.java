package com.kyocoolcool.keycloak.backend.api;

import com.kyocoolcool.keycloak.backend.storage.StorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;


@RestController
@Slf4j
@Component
public class ApiController {

    @Autowired
    StorageService storageService;

    private final HelloService helloService;
    private final ConfigProperty configProperty;

    public ApiController(ConfigProperty configProperty, HelloService helloService) {
        this.helloService = helloService;
        this.configProperty = configProperty;
    }

    @GetMapping("/hello")
    public String getMessage() {
        log.info(helloService.getMessage());
        log.info(configProperty.getMessage());
        return helloService.getMessage();
    }

    @GetMapping(value = "/images/{id}",produces = "image/jpg")
    @ResponseBody
    public ResponseEntity<InputStreamResource> getImage(@PathVariable("id") Integer id) throws IOException {
        Path path = storageService.load(id + ".jpg");
        log.info("path : " + path);
        InputStream inputStream = Files.newInputStream(path);
        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(new InputStreamResource(Files.newInputStream(path)));
    }
}

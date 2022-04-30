package com.kyocoolcool.keycloak.backend.util;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@ConfigurationProperties(prefix = "product")
@PropertySource(value = "classpath:product.property", encoding = "UTF-8")
public class DataTransfer {
    private Map<Integer, String> data;

    public Map<Integer, String> getData() {
        return data;
    }

    public void setData(Map<Integer, String> data) {
        this.data = data;
    }
}
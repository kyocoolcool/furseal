package com.kyocoolcool.keycloak.backend.bill;


import java.time.LocalDateTime;

public interface BillVO {
    Long getBillId();

    Integer getMoney();

    String getGainer();

    String getBuyer();

    String getToMoney();

    LocalDateTime getGainTime();

    LocalDateTime getTransactionTime();

    Character getWay();

    Integer getStatus();

    Long getProductId();

    String getName();

    Integer getCount();
}

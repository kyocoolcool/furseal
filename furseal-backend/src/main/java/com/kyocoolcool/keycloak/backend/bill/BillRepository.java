package com.kyocoolcool.keycloak.backend.bill;

import org.springframework.data.repository.CrudRepository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public interface BillRepository extends CrudRepository<Bill, Long> {

    public List<Bill> findAllByDeletedIs(Boolean deleted);

    public List<Bill> findAllByTransactionTimeBetween(LocalDateTime fromDateInstant, LocalDateTime toDateInstant);
    public List<Bill> findAllByTransactionTimeBetweenAndDeletedIsFalse(LocalDateTime fromDateInstant, LocalDateTime toDateInstant);
}

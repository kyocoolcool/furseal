package com.kyocoolcool.keycloak.backend.bill;

import org.springframework.data.repository.CrudRepository;

import java.time.Instant;
import java.util.List;

public interface BillRepository extends CrudRepository<Bill, Long> {

    public List<Bill> findAllByDeletedIs(Boolean deleted);

    public List<Bill> findAllByTransactionTimeBetween(Instant fromDateInstant, Instant toDateInstant);
    public List<Bill> findAllByTransactionTimeBetweenAndDeletedIsFalse(Instant fromDateInstant, Instant toDateInstant);
}

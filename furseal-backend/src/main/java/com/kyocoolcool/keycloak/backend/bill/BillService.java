package com.kyocoolcool.keycloak.backend.bill;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
public class BillService {
    @Autowired
    BillRepository billRepository;
    public List<Bill> getBills() {
        List<Bill> result =
                StreamSupport.stream( billRepository.findAll().spliterator() , false)
                        .collect(Collectors.toList());
        return result;
    }

    public List<Bill> getBillsByDate(Instant fromDateInstant, Instant toDateInstant) {
        List<Bill> result =
                StreamSupport.stream( billRepository.findAllByTransactionTimeBetween(fromDateInstant, toDateInstant).spliterator() , false)
                        .collect(Collectors.toList());
        return result;
    }
}

package com.kyocoolcool.keycloak.backend.bill;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    public List<Bill> findAllByDeletedIs(Boolean deleted);

    public Bill findBillByBillId(Long billId);

    public List<Bill> findAllByTransactionTimeBetween(LocalDateTime fromDateInstant, LocalDateTime toDateInstant);

    public List<Bill> findAllByTransactionTimeBetweenAndDeletedIsFalse(LocalDateTime fromDateInstant, LocalDateTime toDateInstant);

    public List<Bill> findAllByTransactionTimeBetweenAndDeletedIsFalseAndStatusIs(LocalDateTime fromDateInstant, LocalDateTime toDateInstant, Integer status);

    @Query(value = "select b.bill_id as billId,gm.name as gainer,bum.name as buyer,tm.name as toMoney ,b.money,b.way,b.status,b.gain_time as gainTime,b.transaction_time as transactionTime,p.name, count(bm.bill_id) as count\n" +
            "from bills as b left join products as p on b.product_id=p.product_id left join bill_member bm on b.bill_id = bm.bill_id left join members gm on b.gainer = gm.member_id\n" +
            "    left join members bum on b.buyer=bum.member_id left join members tm on b.to_money=tm.member_id where b.deleted=:deleted \n" +
            "GROUP BY b.bill_id", nativeQuery = true)
    public List<BillVO> getAllBillByDeleted(@Param("deleted") Boolean deleted );
}

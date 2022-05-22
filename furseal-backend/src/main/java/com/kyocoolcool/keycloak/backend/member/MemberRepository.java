package com.kyocoolcool.keycloak.backend.member;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findAllByName(String name);

    Optional<Member> findMemberByMemberId(Long memberId);


    @Query(value = "SELECT u FROM Member u  join fetch u.bills b  WHERE u.memberId = :memberId and b.deleted= false and b.transactionTime between :transactionTime1 and :transactionTime2")
    Optional<Member> findMember(@Param("memberId") Long memberId, @Param("transactionTime1") LocalDateTime transactionTime1, @Param("transactionTime2") LocalDateTime transactionTime2);
//    Optional<Member> findMember(@Param("memberId") Long memberId, @Param("money") Integer money);

}

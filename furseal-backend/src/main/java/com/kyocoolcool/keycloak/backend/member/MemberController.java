package com.kyocoolcool.keycloak.backend.member;

import com.kyocoolcool.keycloak.backend.bill.Bill;
import com.kyocoolcool.keycloak.backend.bill.BillDTO;
import com.kyocoolcool.keycloak.backend.bill.BillRepository;
import com.kyocoolcool.keycloak.backend.util.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@CrossOrigin
@Slf4j
@RequestMapping("members")
public class MemberController {
    @Autowired
    Data data;

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private BillRepository billRepository;

    @GetMapping()
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return new ResponseEntity<List<Member>>(members, HttpStatus.OK);
    }

    @GetMapping("{memberId}")
    public ResponseEntity<MemberDTO> getMemberByMemberId(@PathVariable Long memberId, @RequestParam(required = false) Map<String, String> params) {
        ZoneId zoneId = ZoneId.of("Asia/Taipei");
        LocalDateTime fromDateTime = LocalDateTime.of(Integer.valueOf(params.get("fromDateYear")), Integer.valueOf(params.get("fromDateMonth")), Integer.valueOf(params.get("fromDateDay")), 00, 00, 00);
        LocalDateTime toDateTime = LocalDateTime.of(Integer.valueOf(params.get("toDateYear")), Integer.valueOf(params.get("toDateMonth")), Integer.valueOf(params.get("toDateDay")), 23, 59, 59, 999999999);
//        LocalDateTime fromDateTime = LocalDateTime.of(params.get())now(zoneId).withHour(0).withMinute(0).withSecond(0).withNano(0);;
//        LocalDateTime toDateTime = LocalDateTime.now(zoneId).plusDays(7).withHour(23).withMinute(59).withSecond(59).withNano(999999999);;
//        LocalDate toLocalDate = fromLocalDate.plusDays(7);
        Instant fromDateInstant = fromDateTime.toInstant(ZoneOffset.UTC);
        Instant toDateInstant = toDateTime.toInstant(ZoneOffset.UTC);
        if (params == null) {
            Optional<Member> member = memberRepository.findMemberByMemberId(memberId);
        }
        Optional<Member> member = memberRepository.findMember(memberId, fromDateInstant, toDateInstant);
//        Optional<Member> member = memberRepository.findMember(memberId,fromDateInstant,toDateInstant);

        AtomicReference<MemberDTO> memberDTO = new AtomicReference<>();

        member.ifPresent(x -> {
                    memberDTO.set(new MemberDTO(x.getMemberId(), x.getName(), x.getSalary(), x.getGuild()));
                    List<BillDTO> collect = x.getBills().stream().map(bill -> {
                        if (!bill.getDeleted()) {
                            BillDTO billDTO = new BillDTO(bill.getBillId(), bill.getProduct().getName(), bill.getMoney(), data.getMembers().get(bill.getBuyer()).getName(), bill.getTransactionTime(), bill.getDeleted(), bill.getTax(), bill.getFee());
                            billDTO.setBuyer(data.getMembers().get(bill.getBuyer()).getName());
                            if (bill.getBuyer() == memberId) {
                                billDTO.setAverageSalary((billDTO.getMoney() - billDTO.getFee()) * (1 - billDTO.getTax() / 100.0) / bill.getMembers().size() - billDTO.getMoney());
                            } else {
                                billDTO.setAverageSalary((billDTO.getMoney() - billDTO.getFee()) * (1 - billDTO.getTax() / 100.0) / bill.getMembers().size());
                            }
                            return billDTO;
                        }
                        return null;
                    }).filter(Objects::nonNull).collect(Collectors.toList());
                    memberDTO.get().setBills(collect);
                }
        );

        List<Bill> allByTransactionTimeBetween = billRepository.findAllByTransactionTimeBetweenAndDeletedIsFalse(fromDateInstant, toDateInstant);
        if (memberDTO.get() == null) {
            Optional<Member> memberByMemberId = memberRepository.findMemberByMemberId(memberId);
            memberDTO.set(new MemberDTO(memberByMemberId.get().getMemberId(), memberByMemberId.get().getName(), memberByMemberId.get().getSalary(), memberByMemberId.get().getGuild()));
        }
        List<BillDTO> collect = allByTransactionTimeBetween.stream().map(x -> {
            if (Objects.equals(x.getBuyer(), memberId)) {
                Stream<Member> memberStream = x.getMembers().stream().filter(z -> Objects.equals(z.getMemberId(), memberId));
                if (memberStream.findAny().isEmpty()) {
                    BillDTO billDTO = new BillDTO(x.getBillId(), x.getProduct().getName(), x.getMoney(), data.getMembers().get(x.getBuyer()).getName(), x.getTransactionTime(), x.getDeleted(), x.getTax(), x.getFee());
                    billDTO.setAverageSalary(0.0-x.getMoney());
                    return billDTO;
                }
            }
            return null;
        }).filter(Objects::nonNull).collect(Collectors.toList());
        if (memberDTO.get().getBills() != null) {
            memberDTO.get().getBills().addAll(collect);
        } else {
            memberDTO.get().setBills(collect);
        }
        System.out.println(memberDTO);
        return new ResponseEntity<MemberDTO>(memberDTO.get(), HttpStatus.OK);
    }


}

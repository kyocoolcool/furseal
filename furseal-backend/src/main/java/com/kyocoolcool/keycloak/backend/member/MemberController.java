package com.kyocoolcool.keycloak.backend.member;

import com.kyocoolcool.keycloak.backend.bill.Bill;
import com.kyocoolcool.keycloak.backend.bill.BillDTO;
import com.kyocoolcool.keycloak.backend.bill.BillRepository;
import com.kyocoolcool.keycloak.backend.bill.BillService;
import com.kyocoolcool.keycloak.backend.product.Product;
import com.kyocoolcool.keycloak.backend.product.ProductDto;
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
@RequestMapping("/api/members")
public class MemberController {
    @Autowired
    BillService billService;

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private BillRepository billRepository;

    @GetMapping()
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return new ResponseEntity<List<Member>>(members, HttpStatus.OK);
    }

    @PostMapping()
    public Member createMember(@RequestBody Member member) {
        member.setSalary(0);
        return memberRepository.save(member);
    }

    @GetMapping("/salaries/{memberId}")
    public ResponseEntity<MemberDTO> getMemberByMemberId(@PathVariable Long memberId, @RequestParam(required = false) Map<String, String> params) {
        LocalDateTime fromDateTime = LocalDateTime.of(Integer.valueOf(params.get("fromDateYear")), Integer.valueOf(params.get("fromDateMonth")), Integer.valueOf(params.get("fromDateDay")), 00, 00, 00);
        LocalDateTime toDateTime = LocalDateTime.of(Integer.valueOf(params.get("toDateYear")), Integer.valueOf(params.get("toDateMonth")), Integer.valueOf(params.get("toDateDay")), 23, 59, 59, 999999999);
        Optional<Member> member = memberRepository.findMember(memberId, fromDateTime, toDateTime);
        //有在名單內的薪水,若有收錢則扣除
        AtomicReference<MemberDTO> memberDTO = new AtomicReference<>();
        member.ifPresent(x -> {
                    memberDTO.set(new MemberDTO(x.getMemberId(), x.getName(), x.getSalary(), x.getGuild()));
                    List<BillDTO> collect = x.getBills().stream().map(bill -> {
                        if (!bill.getDeleted() && bill.getStatus()==1) {
                            BillDTO billDTO = new BillDTO(bill.getBillId(), bill.getProduct().getName(), bill.getMoney(), billService.getMembers().get(bill.getBuyer()).getName(), bill.getTransactionTime(), bill.getDeleted(), bill.getTax(), bill.getFee(), bill.getToMoney(), bill.getToMoneyTax());
                            billDTO.setBuyer(billService.getMembers().get(bill.getBuyer()).getName());
                            if (bill.getToMoney() == memberId) {
                                billDTO.setAverageSalary((billDTO.getMoney() - billDTO.getFee()) * (1 - billDTO.getTax() / 100.0) / bill.getMembers().size() - (billDTO.getMoney() - billDTO.getToMoneyTax()));
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

        //計算沒在打寶群的帳,若有收購或者是代收錢都要計算
        List<Bill> allByTransactionTimeBetween = billRepository.findAllByTransactionTimeBetweenAndDeletedIsFalseAndStatusIs(fromDateTime, toDateTime, 1);
        if (memberDTO.get() == null) {
            Optional<Member> memberByMemberId = memberRepository.findMemberByMemberId(memberId);
            memberDTO.set(new MemberDTO(memberByMemberId.get().getMemberId(), memberByMemberId.get().getName(), memberByMemberId.get().getSalary(), memberByMemberId.get().getGuild()));
        }
        List<BillDTO> collect = allByTransactionTimeBetween.stream().map(x -> {
            if (Objects.equals(x.getToMoney() != null ? x.getToMoney() : 0, memberId)) {
                Stream<Member> memberStream = x.getMembers().stream().filter(z -> Objects.equals(z.getMemberId(), memberId));
                if (memberStream.findAny().isEmpty()) {
                    BillDTO billDTO = new BillDTO(x.getBillId(), x.getProduct().getName(), x.getMoney(), billService.getMembers().get(x.getBuyer()).getName(), x.getTransactionTime(), x.getDeleted(), x.getTax(), x.getFee(), x.getToMoney(), x.getToMoneyTax());
                    billDTO.setAverageSalary(0.0 - (x.getMoney() - x.getToMoneyTax()));
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
        log.info(memberDTO.toString());
        return new ResponseEntity<MemberDTO>(memberDTO.get(), HttpStatus.OK);
    }

    @GetMapping("/salaries/nodeal/{memberId}")
    public ResponseEntity<MemberDTO> getMemberByMemberIdNodeal(@PathVariable Long memberId, @RequestParam(required = false) Map<String, String> params) {
        LocalDateTime fromDateTime = LocalDateTime.of(Integer.valueOf(params.get("fromDateYear")), Integer.valueOf(params.get("fromDateMonth")), Integer.valueOf(params.get("fromDateDay")), 00, 00, 00);
        LocalDateTime toDateTime = LocalDateTime.of(Integer.valueOf(params.get("toDateYear")), Integer.valueOf(params.get("toDateMonth")), Integer.valueOf(params.get("toDateDay")), 23, 59, 59, 999999999);
        Optional<Member> member = memberRepository.findMemberNoTrade(memberId, fromDateTime, toDateTime);
        AtomicReference<MemberDTO> memberDTO = new AtomicReference<>();
        member.ifPresent(x -> {
                    memberDTO.set(new MemberDTO(x.getMemberId(), x.getName(), x.getSalary(), x.getGuild()));
                    List<BillDTO> collect = x.getBills().stream().map(bill -> {
                        if (!bill.getDeleted()) {
                            BillDTO billDTO = new BillDTO(bill.getBillId(), bill.getProduct().getName(), bill.getMoney(), null, bill.getGainTime(),bill.getTransactionTime(), bill.getDeleted(), bill.getTax(), bill.getFee(), bill.getToMoney(), bill.getToMoneyTax());
                            return billDTO;
                        }
                        return null;
                    }).filter(Objects::nonNull).collect(Collectors.toList());
                    memberDTO.get().setBills(collect);
                }
        );
        log.info(memberDTO.toString());
        return new ResponseEntity<MemberDTO>(memberDTO.get(), HttpStatus.OK);
    }

    @GetMapping("/user/{memberId}")
    public ResponseEntity<Member> getMemberForUser(@PathVariable Long memberId) {
        Optional<Member> memberOptional = memberRepository.findById(memberId);
        return new ResponseEntity<Member>(memberOptional.orElse(null), HttpStatus.OK);
    }

    @PutMapping("{memberId}")
    public ResponseEntity<Member> updateMember(@PathVariable Long memberId, @RequestBody Member memberDto) {
        Optional<Member> optionalMember = memberRepository.findById(memberId);
        Member member = optionalMember.get();
        member.setName(memberDto.getName());
        member.setGuild(memberDto.getGuild());
        return new ResponseEntity<Member>(memberRepository.save(member), HttpStatus.OK);
    }
}

package com.kyocoolcool.keycloak.backend.bill;

import com.kyocoolcool.keycloak.backend.infra.security.annotation.AllowedRoles;
import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.product.ProductRepository;
import com.kyocoolcool.keycloak.backend.storage.StorageService;
import com.kyocoolcool.keycloak.backend.util.Data;
import com.kyocoolcool.keycloak.backend.util.DataTransfer;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@Slf4j
@RequestMapping("/api/bills")
public class BillController {
    @Autowired
    BillService billService;

    @Autowired
    StorageService storageService;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    DataTransfer dataTransfer;

    @Autowired
    Data data;

    @GetMapping()
    public ResponseEntity<List<BillDTO>> getAllBills() {
        List<Bill> bills = billRepository.findAllByDeletedIs(false);

        List<BillDTO> billDTOs = bills.stream().map(bill -> {
            BillDTO billDTO = new BillDTO();
            BeanUtils.copyProperties(bill, billDTO);
            billDTO.setProductName(bill.getProduct().getName());
            if (bill.getBuyer() != null) {
                billDTO.setBuyer(data.getMembers().get(bill.getBuyer()).getName());
            }
            billDTO.setGainer(data.getMembers().get(bill.getGainer()).getName());
            billDTO.setMemberCount(bill.getMembers().size());
            return billDTO;
        }).collect(Collectors.toList());
        return new ResponseEntity<List<BillDTO>>(billDTOs, HttpStatus.OK);
    }

   @GetMapping("{billId}")
    public ResponseEntity getBill(@PathVariable Long billId) {
        Optional<Bill> billOptional = billRepository.findById(billId);
        BillDTO billDTO = new BillDTO();
        billOptional.ifPresent(bill -> {
            BeanUtils.copyProperties(bill, billDTO);
            billDTO.setProductName(bill.getProduct().getName());
            if (bill.getBuyer() != null) {
                billDTO.setBuyer(data.getMembers().get(bill.getBuyer()).getName());
            }
            if (bill.getToMoney() != null) {
                billDTO.setToMoney(data.getMembers().get(bill.getToMoney()).getName());
            }
            billDTO.setGainer(data.getMembers().get(bill.getGainer()).getName());
            billDTO.setMemberCount(bill.getMembers().size());
        });
        return new ResponseEntity<BillDTO>(billDTO, HttpStatus.OK);
    }

//    @PutMapping("{billId}")
//    public Bill updateBill(@RequestBody BillDTO billDTO) {
//        log.info(billDTO.toString());
//        Bill bill = new Bill();
//        BeanUtils.copyProperties(billDTO, bill);
//        if (billDTO.getBuyer() != null) {
//            bill.setBuyer(data.getMembersByString().get(billDTO.getBuyer()).getMemberId());
//        }
//        if (billDTO.getToMoney() != null) {
//            bill.setToMoney(data.getMembersByString().get(billDTO.getToMoney()).getMemberId());
//        }
//        bill.setGainer(data.getMembersByString().get(billDTO.getGainer()).getMemberId());
//        bill.setProduct(data.getProductsByString().get(billDTO.getProductName()));
//        log.info(bill.toString());
//        return billRepository.save(bill);
//    }

    @PutMapping("{billId}")
    public Bill updateBillWithImage(@RequestPart(value = "file",required = false) MultipartFile file ,@RequestPart(name = "bill") BillDTO billDTO) {
        log.info(billDTO.toString());
        Bill bill = new Bill();
        BeanUtils.copyProperties(billDTO, bill);
        if (billDTO.getBuyer() != null) {
            bill.setBuyer(data.getMembersByString().get(billDTO.getBuyer()).getMemberId());
        }
        if (billDTO.getToMoney() != null) {
            bill.setToMoney(data.getMembersByString().get(billDTO.getToMoney()).getMemberId());
        }
        bill.setGainer(data.getMembersByString().get(billDTO.getGainer()).getMemberId());
        bill.setProduct(data.getProductsByString().get(billDTO.getProductName()));
        Bill result = billRepository.save(bill);
        if (file != null) {
            storageService.store(file,String.valueOf(result.getBillId()));
        }
        return result;
    }

    @DeleteMapping("{billId}")
    @AllowedRoles("ADMIN")
    public Bill deleteBill(@PathVariable Long billId) {
        Optional<Bill> optionalBill = billRepository.findById(billId);
        Bill bill = optionalBill.get();
        bill.setDeleted(true);
        return billRepository.save(bill);
    }

    @PostMapping()
    public Bill createBill(@RequestPart(value = "file",required = false) MultipartFile file ,@RequestPart(name = "bill") BillDTO billDTO) {
        log.info(billDTO.toString());

        Bill bill = new Bill();
        BeanUtils.copyProperties(billDTO, bill);
        if (billDTO.getBuyer() != null) {
            bill.setBuyer(data.getMembersByString().get(billDTO.getBuyer()).getMemberId());
        }
        if (billDTO.getGainer() != null) {
            bill.setGainer(data.getMembersByString().get(billDTO.getGainer()).getMemberId());
        }
        if (billDTO.getToMoney() != null) {
            bill.setToMoney(data.getMembersByString().get(billDTO.getToMoney()).getMemberId());
        }
        bill.setProduct(data.getProductsByString().get(billDTO.getProductName()));
        List<Member> members = billDTO.getMembers();
        bill.setMembers(null);
        Bill billWithMember = billRepository.save(bill);
        billWithMember.setMembers(members);
        Bill result = billRepository.save(billWithMember);
        if (file != null) {
            storageService.store(file,String.valueOf(result.getBillId()));
        }
        return result;
    }

    @GetMapping("salaries")
    public ResponseEntity<List<Member>> getSalaries() {
        ZoneId zoneId = ZoneId.of("Asia/Taipei");
        LocalDateTime fromDateTime = LocalDateTime.now(zoneId).withHour(0).withMinute(0).withSecond(0).withNano(0);;
        LocalDateTime toDateTime = LocalDateTime.now(zoneId).plusDays(7).withHour(23).withMinute(59).withSecond(59).withNano(999999999);;
        Instant fromDateInstant = fromDateTime.toInstant(ZoneOffset.UTC);
        Instant toDateInstant = toDateTime.toInstant(ZoneOffset.UTC);
        Map<Long, Member> members = data.getMembers();
        HashMap<Long, Member> memberHashMap = new HashMap<>();
        members.forEach((x,y)->memberHashMap.put(x,new Member(y.getMemberId(), y.getName(),y.getSalary(),y.getGuild())));
        Iterable<Bill> billsIterable = billService.getBillsByDate(fromDateInstant, toDateInstant);
        billsIterable.forEach(x->{
            if (!x.getDeleted() &&  x.getStatus()==1 && x.getMembers().size() > 0) {
                Double averageSalary = (x.getMoney() - x.getFee())*(1-x.getTax()/100.0)/x.getMembers().size();
                x.getMembers().forEach(y-> {
                    Member member = memberHashMap.get(y.getMemberId());
                    member.setSalary(member.getSalary()+averageSalary.intValue());
                });
                if (x.getToMoney() != null && x.getToMoney() != 0) {
                    Member toMoney = memberHashMap.get(x.getToMoney());
                    toMoney.setSalary(toMoney.getSalary()-(x.getMoney()-x.getToMoneyTax()));

                } else {
                    Member buyer = memberHashMap.get(x.getBuyer());
                    buyer.setSalary(buyer.getSalary()-(x.getMoney()-x.getToMoneyTax()));
                }
            }
        });
        List<Member> memberList = memberHashMap.values().stream().collect(Collectors.toList());
        return new ResponseEntity<List<Member>>(memberList, HttpStatus.OK);
    }

    @GetMapping("salariesByDate")
    public ResponseEntity<List<Member>> getSalariesByDate(@RequestParam Map<String, String> params) {
        log.info(params.toString());
        Map<Long, Member> members = data.getMembers();
        HashMap<Long, Member> memberHashMap = new HashMap<>();
        members.forEach((x, y) -> memberHashMap.put(x, new Member(y.getMemberId(), y.getName(), y.getSalary(), y.getGuild())));
        LocalDateTime fromDateTime = LocalDateTime.of(Integer.valueOf(params.get("fromDateYear")), Integer.valueOf(params.get("fromDateMonth")), Integer.valueOf(params.get("fromDateDay")), 00, 00, 00);
        LocalDateTime toDateTime = LocalDateTime.of(Integer.valueOf(params.get("toDateYear")), Integer.valueOf(params.get("toDateMonth")), Integer.valueOf(params.get("toDateDay")), 23, 59, 59, 999999999);
        Instant fromDateInstant = fromDateTime.toInstant(ZoneOffset.UTC);
        Instant toDateInstant = toDateTime.toInstant(ZoneOffset.UTC);
        Iterable<Bill> billsIterable = billService.getBillsByDate(fromDateInstant, toDateInstant);
        billsIterable.forEach(x -> {
            if (!x.getDeleted() &&  x.getStatus()==1 && x.getMembers().size() > 0) {
                Double averageSalary = (x.getMoney() - x.getFee()) * (1 - x.getTax() / 100.0) / x.getMembers().size();
                x.getMembers().forEach(y -> {
                    Member member = memberHashMap.get(y.getMemberId());
                    member.setSalary(member.getSalary() + averageSalary.intValue());
                });
                if (x.getToMoney() != null && x.getToMoney() != 0) {
                    Member toMoney = memberHashMap.get(x.getToMoney());
                    toMoney.setSalary(toMoney.getSalary()-(x.getMoney()-x.getToMoneyTax()));

                } else {
                    Member buyer = memberHashMap.get(x.getBuyer());
                    buyer.setSalary(buyer.getSalary()-(x.getMoney()-x.getToMoneyTax()));
                }
            }
        });
        List<Member> memberList = memberHashMap.values().stream().collect(Collectors.toList());
        return new ResponseEntity<List<Member>>(memberList, HttpStatus.OK);
    }

    @GetMapping("salaries/tax")
    public ResponseEntity< List<BillDTO>> getSalariesByTax() {
        List<Bill> bills = billRepository.findAllByDeletedIs(false);
        List<BillDTO> billDTOs = bills.stream().map(bill -> {
            BillDTO billDTO = new BillDTO();
            BeanUtils.copyProperties(bill, billDTO);
            billDTO.setProductName(bill.getProduct().getName());
            billDTO.setBuyer(data.getMembers().get(bill.getBuyer()).getName());
            billDTO.setGainer(data.getMembers().get(bill.getGainer()).getName());
            billDTO.setMemberCount(bill.getMembers().size());
            return billDTO;
        }).collect(Collectors.toList());
        return new ResponseEntity<List<BillDTO>>(billDTOs, HttpStatus.OK);
    }
}

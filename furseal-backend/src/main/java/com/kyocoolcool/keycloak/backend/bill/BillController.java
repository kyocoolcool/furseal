package com.kyocoolcool.keycloak.backend.bill;

import com.kyocoolcool.keycloak.backend.infra.security.annotation.AllowedRoles;
import com.kyocoolcool.keycloak.backend.member.Member;
import com.kyocoolcool.keycloak.backend.product.Product;
import com.kyocoolcool.keycloak.backend.product.ProductRepository;
import com.kyocoolcool.keycloak.backend.storage.StorageService;
import com.kyocoolcool.keycloak.backend.util.DataTransfer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
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

    SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSz");


    @GetMapping()
    public ResponseEntity<List<BillDTO>> getAllBills() {
        List<BillVO> bills = billRepository.getAllBillByDeleted(false);
        List<BillDTO> billDTOs = bills.stream().map(billVo -> {
            BillDTO billDTO = new BillDTO();
            BeanUtils.copyProperties(billVo, billDTO);
            billDTO.setProductName(billVo.getName());

            if (billVo.getGainer() != null) {
                billDTO.setGainer(billVo.getGainer());
            }
            if (billVo.getBuyer() != null) {
                billDTO.setBuyer(billVo.getBuyer());
            }
            billDTO.setMemberCount(billVo.getCount());
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
                billDTO.setBuyer(billService.getMembers().get(bill.getBuyer()).getName());
            }
            if (bill.getToMoney() != null) {
                billDTO.setToMoney(billService.getMembers().get(bill.getToMoney()).getName());
            }
            billDTO.setGainer(billService.getMembers().get(bill.getGainer()).getName());
            billDTO.setMemberCount(bill.getMembers().size());
        });
        return new ResponseEntity<BillDTO>(billDTO, HttpStatus.OK);
    }

    @PutMapping("{billId}")
    public Bill updateBillWithImage(@RequestPart(value = "file", required = false) MultipartFile file, @RequestPart(name = "bill") BillDTO2 billDTO) throws ParseException {
        log.info(billDTO.toString());
        Bill bill = new Bill();
        BeanUtils.copyProperties(billDTO, bill);

        if (billDTO.getGainTime() != null) {
            LocalDateTime dateTime = LocalDateTime.parse(billDTO.getGainTime(), formatter);
            bill.setGainTime(dateTime);
        }
        if (billDTO.getTransactionTime() != null) {
            LocalDateTime dateTime = LocalDateTime.parse(billDTO.getTransactionTime(), formatter);
            bill.setTransactionTime(dateTime);
        }
        if (billDTO.getBuyer() != null) {
            bill.setBuyer(billService.getMembersByString().get(billDTO.getBuyer()).getMemberId());
        }
        if (billDTO.getToMoney() != null) {
            bill.setToMoney(billService.getMembersByString().get(billDTO.getToMoney()).getMemberId());
        }
        bill.setGainer(billService.getMembersByString().get(billDTO.getGainer()).getMemberId());
        bill.setProduct(billService.getProductsByString().get(billDTO.getProductName()));
        Bill result = billRepository.save(bill);
        if (file != null) {
            storageService.store(file, String.valueOf(result.getBillId()));
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
    public Bill createBill(@RequestPart(value = "file", required = false) MultipartFile file, @RequestPart(name = "bill") BillDTO2 billDTO) throws ParseException {
        Bill bill = new Bill();
        BeanUtils.copyProperties(billDTO, bill);
        if (billDTO.getGainTime() != null) {
            LocalDateTime dateTime = LocalDateTime.parse(billDTO.getGainTime(), formatter);
            bill.setGainTime(dateTime);
        }
        if (billDTO.getTransactionTime() != null) {
            LocalDateTime dateTime = LocalDateTime.parse(billDTO.getTransactionTime(), formatter);
            bill.setTransactionTime(dateTime);
        }
        if (billDTO.getBuyer() != null) {
            bill.setBuyer(billService.getMembersByString().get(billDTO.getBuyer()).getMemberId());
        }
        if (billDTO.getGainer() != null) {
            bill.setGainer(billService.getMembersByString().get(billDTO.getGainer()).getMemberId());
        }
        if (billDTO.getToMoney() != null) {
            bill.setToMoney(billService.getMembersByString().get(billDTO.getToMoney()).getMemberId());
        }
        bill.setProduct(billService.getProductsByString().get(billDTO.getProductName()));
        List<Member> members = billDTO.getMembers();
        bill.setMembers(null);
        Bill billWithMember = billRepository.save(bill);
        billWithMember.setMembers(members);
        Bill result = billRepository.save(billWithMember);
        if (file != null) {
            storageService.store(file, String.valueOf(result.getBillId()));
        }
        return result;
    }

    @GetMapping("salaries")
    public ResponseEntity<List<Member>> getSalaries() {
        ZoneId zoneId = ZoneId.of("Asia/Taipei");
        LocalDateTime fromDateTime = LocalDateTime.now(zoneId).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime toDateTime = LocalDateTime.now(zoneId).plusDays(7).withHour(23).withMinute(59).withSecond(59).withNano(999999999);
        Map<Long, Member> members = billService.getMembers();
        HashMap<Long, Member> memberHashMap = new HashMap<>();
        members.forEach((x, y) -> memberHashMap.put(x, new Member(y.getMemberId(), y.getName(), y.getSalary(), y.getGuild())));
        Iterable<Bill> billsIterable = billService.getBillsByDate(fromDateTime, toDateTime);
        billsIterable.forEach(x -> {
            if (!x.getDeleted() && x.getStatus() == 1 && x.getMembers().size() > 0) {
                Double averageSalary = (x.getMoney() - x.getFee()) * (1 - x.getTax() / 100.0) / x.getMembers().size();
                x.getMembers().forEach(y -> {
                    Member member = memberHashMap.get(y.getMemberId());
                    member.setSalary(member.getSalary() + averageSalary.intValue());
                });
                if (x.getToMoney() != null && x.getToMoney() != 0) {
                    Member toMoney = memberHashMap.get(x.getToMoney());
                    toMoney.setSalary(toMoney.getSalary() - (x.getMoney() - x.getToMoneyTax()));

                } else {
                    Member buyer = memberHashMap.get(x.getBuyer());
                    buyer.setSalary(buyer.getSalary() - (x.getMoney() - x.getToMoneyTax()));
                }
            }
        });
        List<Member> memberList = memberHashMap.values().stream().collect(Collectors.toList());
        return new ResponseEntity<List<Member>>(memberList, HttpStatus.OK);
    }

    @GetMapping("salariesByDate")
    public ResponseEntity<List<Member>> getSalariesByDate(@RequestParam Map<String, String> params) {
        log.info(params.toString());
        Map<Long, Member> members = billService.getMembers();
        HashMap<Long, Member> memberHashMap = new HashMap<>();
        members.forEach((x, y) -> memberHashMap.put(x, new Member(y.getMemberId(), y.getName(), y.getSalary(), y.getGuild())));
        LocalDateTime fromDateTime = LocalDateTime.of(Integer.valueOf(params.get("fromDateYear")), Integer.valueOf(params.get("fromDateMonth")), Integer.valueOf(params.get("fromDateDay")), 00, 00, 00);
        LocalDateTime toDateTime = LocalDateTime.of(Integer.valueOf(params.get("toDateYear")), Integer.valueOf(params.get("toDateMonth")), Integer.valueOf(params.get("toDateDay")), 23, 59, 59, 999999999);
        Iterable<Bill> billsIterable = billService.getBillsByDate(fromDateTime, toDateTime);
        billsIterable.forEach(x -> {
            if (!x.getDeleted() && x.getStatus() == 1 && x.getMembers().size() > 0) {
                Double averageSalary = (x.getMoney() - x.getFee()) * (1 - x.getTax() / 100.0) / x.getMembers().size();
                x.getMembers().forEach(y -> {
                    Member member = memberHashMap.get(y.getMemberId());
                    member.setSalary(member.getSalary() + averageSalary.intValue());
                });
                if (x.getToMoney() != null && x.getToMoney() != 0) {
                    Member toMoney = memberHashMap.get(x.getToMoney());
                    toMoney.setSalary(toMoney.getSalary() - (x.getMoney() - x.getToMoneyTax()));

                } else {
                    Member buyer = memberHashMap.get(x.getBuyer());
                    buyer.setSalary(buyer.getSalary() - (x.getMoney() - x.getToMoneyTax()));
                }
            }
        });
        List<Member> memberList = memberHashMap.values().stream().collect(Collectors.toList());
        return new ResponseEntity<List<Member>>(memberList, HttpStatus.OK);
    }

    @GetMapping("salaries/tax")
    public ResponseEntity<List<BillDTO>> getSalariesByTax() {
        List<Bill> bills = billRepository.findAllByDeletedIs(false);
        List<BillDTO> billDTOs = bills.stream().map(bill -> {
            BillDTO billDTO = new BillDTO();
            BeanUtils.copyProperties(bill, billDTO);
            billDTO.setProductName(bill.getProduct().getName());
            if (bill.getBuyer() != null) {
                billDTO.setBuyer(billService.getMembers().get(bill.getBuyer()).getName());
            }
            billDTO.setGainer(billService.getMembers().get(bill.getGainer()).getName());
            billDTO.setMemberCount(bill.getMembers().size());
            return billDTO;
        }).collect(Collectors.toList());
        return new ResponseEntity<List<BillDTO>>(billDTOs, HttpStatus.OK);
    }


    @PostMapping("copy")
    public ResponseEntity<List<BillDTO>> copyBill(@RequestBody Integer billId) {
        Optional<Bill> byId = billRepository.findById(Long.valueOf(billId));
        Bill bill = byId.get();
        Bill newBill = new Bill();
        BeanUtils.copyProperties(bill, newBill);
        newBill.setMembers(null);
        newBill.setBillId(null);
        List<Member> members = bill.getMembers();
        List<Member> newMembers = new ArrayList<>();
        members.forEach(x-> newMembers.add(new Member(x.getMemberId(),x.getName(),x.getSalary(),x.getGuild())));
        Bill billWithMember = billRepository.save(newBill);
        billWithMember.setMembers(newMembers);
        billRepository.save(billWithMember);
        return getAllBills();
    }
}

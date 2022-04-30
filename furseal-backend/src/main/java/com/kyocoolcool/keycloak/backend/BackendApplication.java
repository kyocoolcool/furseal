package com.kyocoolcool.keycloak.backend;

import com.kyocoolcool.keycloak.backend.bill.BillRepository;
import com.kyocoolcool.keycloak.backend.member.MemberRepository;
import com.kyocoolcool.keycloak.backend.product.ProductRepository;
import com.kyocoolcool.keycloak.backend.util.DataTransfer;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Log4j2
@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Autowired
	DataTransfer dataTransfer;

	@Autowired
	ProductRepository productRepository;

//	@Autowired
//	MemberData memberData;

	@Autowired
	MemberRepository memberRepository;

	@Autowired
	BillRepository billRepository;

//	@Autowired
//	Data data;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) {
//		Product product = new Product(1L, "紅武布", 10000);
//		Product save = productRepository.save(product);
//		Member chris = memberRepository.save(new Member(1L, "chris", 10000));
//		Member mary = memberRepository.save(new Member(2L, "mary", 20000));
//		List<Member> hello = memberRepository.findAllByName("chris");
//		System.out.println(hello);
//		Bill bill = new Bill(1L, 10000, 1L, 1L, (char) 1, 1, false, null, null, null, save);
//		bill.setMembers(Arrays.asList(chris,mary));
//		billRepository.save(bill)bill;

//		billRepository.save(new Bill(2L, 10000, 1, 1, (char) 1, 1, null, null, null, null,save));

//		log.info(memberRepository.findAll());
//		log.info(data);
//		log.info(billRepository.findBillsByProductId(1));
//		for (int i = 0; i < args.length; ++i) {
//			log.info("args[{}]: {}", i, args[i]);
//		}
//		log.info(memberData.getMemberMap());
	}


}

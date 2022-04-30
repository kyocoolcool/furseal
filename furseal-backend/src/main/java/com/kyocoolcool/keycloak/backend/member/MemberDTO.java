package com.kyocoolcool.keycloak.backend.member;

import com.kyocoolcool.keycloak.backend.bill.BillDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MemberDTO implements Serializable {
    private Long memberId;
    private String name;
    private Integer salary;
    private String guild;
    private List<BillDTO> bills;

    public MemberDTO(Long memberId, String name, Integer salary, String guild) {
        this.memberId = memberId;
        this.name = name;
        this.salary = salary;
        this.guild = guild;
    }
}
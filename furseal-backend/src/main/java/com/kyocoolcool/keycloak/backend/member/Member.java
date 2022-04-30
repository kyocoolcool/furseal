package com.kyocoolcool.keycloak.backend.member;

import com.kyocoolcool.keycloak.backend.bill.Bill;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "members")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Member implements Serializable {
    @Id
    @Column(name = "member_id", nullable = false, precision = 10)
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long memberId;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "salary")
    private Integer salary;

    @Column(name = "guild", length = 40)
    private String guild;

    @ManyToMany(mappedBy = "members", fetch = FetchType.EAGER)
//    @JsonIgnore
    private List<Bill> bills;

    public Member(Long memberId, String name, Integer salary, String guild) {
        this.memberId = memberId;
        this.name = name;
        this.salary = salary;
        this.guild = guild;
    }
}
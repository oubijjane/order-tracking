package com.verAuto.orderTracking.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String companyName;

    @OneToMany(mappedBy = "company")
    @JsonManagedReference(value = "company-usercompany")
    private Set<UserCompany> users = new HashSet<>();
}

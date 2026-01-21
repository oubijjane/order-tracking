package com.verAuto.orderTracking.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.verAuto.orderTracking.enums.CompanyAssignmentType;
import com.verAuto.orderTracking.service.CompanyService;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class UserCompany {

    @EmbeddedId
    private UserCompanyId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference(value = "user-usercompany")
    private User user;

    @ManyToOne
    @MapsId("companyId")
    @JoinColumn(name = "company_id", nullable = false)
    @JsonBackReference(value = "company-usercompany")
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyAssignmentType type;



}

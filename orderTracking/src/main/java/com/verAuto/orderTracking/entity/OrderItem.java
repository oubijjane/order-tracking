package com.verAuto.orderTracking.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column
    private String carName;

    @Column
    private String carModel;

    @Column
    private int year;

    @Column
    private String image;

    @Column
    private String status;

    @Column
    private String destination;

    @Column
    private String companyName;

    @Column
    private String registrationNumber;

    @Column
    private String comment;

}

package com.verAuto.orderTracking.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class orderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column
    @NotBlank(message = "required")
    private String carName;

    @Column
    @NotBlank(message = "required")
    private String carModel;

    @Column
    @NotBlank(message = "required")
    private int year;

    @Column
    @NotBlank(message = "required")
    private String image;

    @Column
    @NotBlank(message = "required")
    private String status;

    @Column
    @NotBlank(message = "required")
    private String destination;

    @Column
    @NotBlank(message = "required")
    private String companyName;

    @Column
    @NotBlank(message = "required")
    private String registrationNumber;

    @Column
    @NotBlank(message = "required")
    private String comment;
    
}

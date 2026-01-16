package com.verAuto.orderTracking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class CarModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String model;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private CarBrand carBrand;
}

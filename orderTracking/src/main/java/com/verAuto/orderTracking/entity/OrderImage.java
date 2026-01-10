package com.verAuto.orderTracking.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class OrderImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String url; // or the file path

    @ManyToOne
    @JoinColumn(name = "order_item_id")
    @JsonBackReference
    private OrderItem orderItem;


}
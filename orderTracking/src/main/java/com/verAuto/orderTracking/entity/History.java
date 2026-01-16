package com.verAuto.orderTracking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Getter
@Setter
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderItem order;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at", columnDefinition = "DATETIME(0)")
    private Date createdAt;

    @Column
    private String changedBy;

    @Column
    private String action;

    @Column
    private String oldValue;

    @Column
    private String newValue;

}

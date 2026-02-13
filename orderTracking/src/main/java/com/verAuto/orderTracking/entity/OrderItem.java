package com.verAuto.orderTracking.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.verAuto.orderTracking.enums.OrderStatus;
import com.verAuto.orderTracking.enums.WindowType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le vitre est obligatoire")
    private WindowType windowType;


    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    @NotNull
    private CarModel carModel;

    @ManyToOne
    @JoinColumn(name = "transitCompany_id", nullable = true)
    private TransitCompany transitCompany;

    @Column
    private String declarationNumber;

    @Column
    private String fileNumber;


    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderImage> images;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le statut est obligatoire")
    private OrderStatus status;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at", columnDefinition = "DATETIME(0)")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", columnDefinition = "DATETIME(0)")
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "city_id", nullable = true)
    private City city;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    @NotNull
    private Company company;

    @Column
    @NotBlank(message = "L'immatriculation est obligatoire")
    private String registrationNumber;

    @Column
    private String groupId;

    @Column
    private String comment;

    @Column
    private String phoneNumber;


}

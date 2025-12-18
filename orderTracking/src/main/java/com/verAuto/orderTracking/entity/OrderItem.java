package com.verAuto.orderTracking.entity;

import com.verAuto.orderTracking.enums.OrderStatus;
import com.verAuto.orderTracking.enums.WindowType;
import jakarta.annotation.Generated;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Year;

@Setter
@Getter
@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le vitre est obligatoire")
    private WindowType windowType;


    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private CarModel carModel;

    @Column
    @Min(value = 1990, message = "L'année doit être supérieure à 1990")
    private int year;

    @Column
    @NotBlank(message = "L'image est obligatoire")
    private String image;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le statut est obligatoire")
    private OrderStatus status;

    @Column
    @NotBlank(message = "La destination est obligatoire")
    private String destination;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column
    @NotBlank(message = "L'immatriculation est obligatoire")
    private String registrationNumber;

    @Column
    private String comment;

    @AssertTrue(message = "L'année ne peut pas être dans le futur")
    public boolean isYearValid() {
        // dynamic check: year must be less than or equal to current year
        return year <= Year.now().getValue();
    }
}

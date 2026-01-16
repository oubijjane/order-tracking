package com.verAuto.orderTracking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
public class CarBrand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @NotBlank
    private String brand;

    @OneToMany(mappedBy = "carBrand", cascade = CascadeType.ALL)
    @JsonIgnore // Prevents infinite loop when fetching JSON
    private List<CarModel> models = new ArrayList<>();


}

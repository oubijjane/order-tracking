package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.entity.WindowBrand;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class WindowDetailsDTO {

    private Long id;
    private BigDecimal price;
    private Long orderId;
    private Long windowBrandId;
    private String windowBrand;
}

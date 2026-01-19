package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.enums.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class OrderItemDTO {
    private OrderStatus orderStatus;
    private List<WindowDetailsDTO> windowDetailsList = new ArrayList<>();
    private Long comment;
    private Long transitCompanyId;
    private String declarationNumber;
    private Long selectedWindowDetail;
    private String windowBrand;
    private BigDecimal price;
    private String fileNumber;
}

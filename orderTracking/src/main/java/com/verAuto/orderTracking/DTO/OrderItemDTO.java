package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private OrderStatus orderStatus;
    private List<WindowDetailsDTO> windowDetailsList = new ArrayList<>();
    private Long comment;
    private String additionalComment;
    private Long transitCompanyId;
    private String declarationNumber;
    private Long selectedWindowDetail;
    private Long cityId;
    private String windowBrand;
    private BigDecimal price;
    private String phoneNumber;
    private String fileNumber;
}

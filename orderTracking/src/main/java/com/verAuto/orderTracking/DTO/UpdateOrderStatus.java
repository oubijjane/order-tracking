package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.enums.OrderStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatus {
    private OrderStatus orderStatus;
    private Long comment;
    private Long transitCompanyId;
    private String declarationNumber;
}

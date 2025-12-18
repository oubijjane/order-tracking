package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.entity.OrderItem;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateOrderRequest {
    private OrderItem orderItem; // or just the fields like quantity
    private Long carModelId;// We only need the ID from the frontend
    private Long companyId;
}

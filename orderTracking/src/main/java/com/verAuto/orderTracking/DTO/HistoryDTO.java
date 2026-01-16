package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.entity.OrderItem;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class HistoryDTO {
    private OrderItem order;
    private String changedBy;
    private String action;
    private String oldValue;
    private String newValue;
    private Date createAt;
}

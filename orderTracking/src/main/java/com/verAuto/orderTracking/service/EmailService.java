package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.OrderItem;

public interface EmailService {
    void sendOrderNotification(OrderItem order, String receiverEmail);
}

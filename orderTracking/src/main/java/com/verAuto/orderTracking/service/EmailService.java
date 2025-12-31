package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.OrderItem;

import java.util.List;

public interface EmailService {
    void sendOrderNotification(OrderItem order, List<String> receiverEmails);
}

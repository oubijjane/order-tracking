package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.enums.OrderStatus;

import java.util.List;
import java.util.Map;

public interface OrderItemService {
    List<OrderItem> findAll();
    List<OrderItem> findByRegistrationNumber(String registrationNumber);
    OrderItem updateOrderStatus(Long id, OrderStatus orderStatus);
    Map<OrderStatus, Long> getStatusCounts();
    List<OrderItem> findOrderByStatus(OrderStatus status);
    OrderItem findById(Long id);
    OrderItem save(OrderItem orderItem);
    void deleteById(Long id);
}

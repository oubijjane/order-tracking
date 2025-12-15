package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.OrderItem;

import java.util.List;

public interface OrderItemService {
    List<OrderItem> findAll();
    List<OrderItem> findByCompanyName(String companyName);
    List<OrderItem> findByDestination(String destination);
    List<OrderItem> findByRegistrationNumber(String registrationNumber);
    OrderItem findById(int id);
    OrderItem save(OrderItem orderItem);
    void deleteById(int id);
}

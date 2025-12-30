package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.enums.OrderStatus;
import org.hibernate.query.Order;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface OrderItemService {
    List<OrderItem> findAll(User user);
    List<OrderItem> findByRegistrationNumber(String registrationNumber);
    OrderItem updateOrderStatus(Long id, OrderStatus orderStatus);
    Map<OrderStatus, Long> getStatusCounts(User user);
    Page<OrderItem> findOrderByStatus(OrderStatus status, User user, int page, int size);
    OrderItem findById(Long id);
    List<OrderItem> findUserOrders(User user);
    OrderItem save(OrderItem orderItem, User user);
    OrderItem updateStatus(Long id, OrderStatus status, User user);
    void deleteById(Long id);
}

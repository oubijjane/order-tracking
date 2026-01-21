package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.OrderItemDTO;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface OrderItemService {
    List<OrderItem> findAll(User user);
    List<OrderItem> findAllForReport(User user, String companyName, String cityName,
                                     String registrationNumber, String status);
    Page<OrderItem> findOrdersDynamic(User user, String companyName, String cityName, String registrationNumber,
                                      String status,int page, int size);
    Page<OrderItem> findOrderItemByUserId(User user, int page, int size);
    List<OrderItem> findByRegistrationNumber(String registrationNumber);
    OrderItem updateOrderStatus(Long id, OrderStatus orderStatus);
    Map<OrderStatus, Long> getStatusCounts(User user);
    Page<OrderItem> findOrderByStatus(OrderStatus status, User user, int page, int size);
    OrderItem findById(Long id);
    List<OrderItem> findUserOrders(User user);
    OrderItem save(OrderItem orderItem, User user, MultipartFile[] files);
    OrderItem updateStatusAndComment(Long id, OrderItemDTO status, User user);
    void deleteById(Long id);
}

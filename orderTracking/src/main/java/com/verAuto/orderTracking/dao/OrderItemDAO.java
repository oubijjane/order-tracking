package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemDAO extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByRegistrationNumber(String registrationNumber);
    List<OrderItem> findByStatus(OrderStatus status);
    @Query("SELECT o.status, COUNT(o) FROM OrderItem o GROUP BY o.status")
    List<Object[]> countOrdersByStatusRaw();

}

package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemDAO extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByDestination(String destination);
    List<OrderItem> findByRegistrationNumber(String registrationNumber);

}

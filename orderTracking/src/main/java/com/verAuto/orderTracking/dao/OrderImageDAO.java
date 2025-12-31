package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.OrderImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderImageDAO extends JpaRepository<OrderImage, Long> {
    List<OrderImage> findByOrderItemId(Long id);
    void deleteByOrderItemId(Long id);
}

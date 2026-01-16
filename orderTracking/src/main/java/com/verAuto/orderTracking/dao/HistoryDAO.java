package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryDAO extends JpaRepository<History, Long> {
    List<History> findHistoryByOrderId(long orderId);
    void deleteByOrderId(long orderId);
}

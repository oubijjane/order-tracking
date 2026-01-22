package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.WindowDetails;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WindowDetailsDAO extends JpaRepository<WindowDetails, Long> {
    List<WindowDetails> getWindowDetailsByOrderId(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM WindowDetails w WHERE w.order.id = :orderId AND w.id <> :selectedId")
    void deleteByOrderIdAndIdNot(@Param("orderId") Long orderId, @Param("selectedId") Long selectedId);

    @Modifying
    @Transactional
    @Query("DELETE FROM WindowDetails w WHERE w.order.id = :orderId")
    void deleteByOrderItemId(@Param("orderId") Long orderId);
}

package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.UserDevice;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserDeviceDAO extends JpaRepository<UserDevice, Integer> {
    List<UserDevice> findByUserId(Long userId);
    
    @Query("SELECT ud FROM UserDevice ud WHERE ud.user.userName = :userName")
    List<UserDevice> findByUserName(@Param("userName") String userName);
    
    // Delete device(s) by token
    @Modifying
    @Transactional
    void deleteByToken(String token);
    
    // Find by token
    List<UserDevice> findByToken(String token);

    // Delete devices not seen since given timestamp
    void deleteByLastSeenBefore(java.time.Instant threshold);
}

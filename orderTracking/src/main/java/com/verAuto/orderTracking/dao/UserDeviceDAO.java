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

    @Query("SELECT ud FROM UserDevice ud JOIN FETCH ud.user WHERE ud.user.id IN :userIds")
    List<UserDevice> findByIds(@Param("userIds") List<Integer> userIds);

    @Query("SELECT ud FROM UserDevice ud " +
            "JOIN FETCH ud.user u " +
            "JOIN UserRole ur ON ur.user.id = u.id " +
            "WHERE ur.role.id = :roleId")
    List<UserDevice> findAllDevicesByRoleId(@Param("roleId") Integer roleId);

    @Query("SELECT ud FROM UserDevice ud " +
            "JOIN FETCH ud.user u " +
            "JOIN UserRole ur ON ur.user.id = u.id " +
            "WHERE ur.role.id in :roleId")
    List<UserDevice> findAllDevicesByRoleIds(@Param("roleId") List<Integer> roleId);
    // Delete device(s) by token
    @Modifying
    @Transactional
    void deleteByToken(String token);
    
    // Find by token
    List<UserDevice> findByToken(String token);

    // Delete devices not seen since given timestamp
    void deleteByLastSeenBefore(java.time.Instant threshold);
}

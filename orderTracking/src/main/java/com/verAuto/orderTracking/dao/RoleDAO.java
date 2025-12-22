package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleDAO extends JpaRepository<Role, Integer> {
}

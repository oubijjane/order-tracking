package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDAO extends JpaRepository<User, Integer> {
    User findByUserName(String name);

}

package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDAO extends JpaRepository<User, Integer> {
    Optional<User> findByUserName(String name);

}

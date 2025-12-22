package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAll();
    User findById(int id);
    User findUserByName(String name);
    User saveNewUser(User user);
    void deleteUserById(int id);
}

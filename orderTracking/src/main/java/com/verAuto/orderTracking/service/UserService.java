package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.UserDTO;
import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAll();
    User findById(int id);
    User findUserByName(String name);
    List<Company> getUserCompany(int id);
    User saveNewUser(UserDTO user);
    User updateUser(int id, UserDTO user);
    void deleteUserById(int id);
}

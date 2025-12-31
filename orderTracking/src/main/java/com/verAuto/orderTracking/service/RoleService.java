package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.Role;
import com.verAuto.orderTracking.entity.User;

import java.util.List;

public interface RoleService {
    List<Role> findAll();
    Role findRoleById(int id);
    Role saveRole(Role role);
    void deleteById(int id);
}

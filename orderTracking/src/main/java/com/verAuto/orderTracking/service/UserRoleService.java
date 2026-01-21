package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CreateUserRole;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserRole;
import com.verAuto.orderTracking.entity.UserRoleId;

import java.util.List;

public interface UserRoleService {
    List<UserRole> findUserRolesById(int id);
    List<UserRole> findAll();
    List<User> findUsersByRoleName(String role);
    UserRole saveUserRole(CreateUserRole userRole);
    void deleteByUserId(int id);
    void deleteRole(UserRoleId id);
}

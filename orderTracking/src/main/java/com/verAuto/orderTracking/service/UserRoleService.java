package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CreatUserRole;
import com.verAuto.orderTracking.entity.Role;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserRole;
import com.verAuto.orderTracking.entity.UserRoleId;

import java.util.List;

public interface UserRoleService {
    List<UserRole> findUserRolesById(int id);
    List<UserRole> findAll();
    UserRole saveUserRole(CreatUserRole userRole);
    void deleteRole(UserRoleId id);
}

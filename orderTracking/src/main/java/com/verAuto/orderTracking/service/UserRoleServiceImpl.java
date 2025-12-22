package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CreatUserRole;
import com.verAuto.orderTracking.dao.RoleDAO;
import com.verAuto.orderTracking.dao.UserDAO;
import com.verAuto.orderTracking.dao.UserRoleDOA;
import com.verAuto.orderTracking.entity.Role;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserRole;
import com.verAuto.orderTracking.entity.UserRoleId;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class UserRoleServiceImpl implements UserRoleService{

    private UserRoleDOA userRoleDOA;
    private RoleDAO roleDAO;
    private UserDAO userDAO;

    @Autowired
    public UserRoleServiceImpl(UserRoleDOA userRoleDOA, UserDAO userDAO, RoleDAO roleDAO) {
        this.userRoleDOA = userRoleDOA;
        this.userDAO = userDAO;
        this.roleDAO = roleDAO;
    }
    @Override
    public List<UserRole> findUserRolesById(int id) {
        return userRoleDOA.findByIdRoleId(id);
    }

    @Override
    public List<UserRole> findAll() {
        return userRoleDOA.findAll();
    }

    @Override
    public UserRole saveUserRole(CreatUserRole userRole) {
        Role role = roleDAO.findById(userRole.getRoleId())
                .orElseThrow(() -> new RuntimeException("could not find role with the id - " + userRole.getRoleId()));
        User user = userDAO.findById(userRole.getUserId())
                .orElseThrow(() -> new RuntimeException("could not find user with the id - " + userRole.getUserId()));
        UserRole newUserRole = new UserRole();
        newUserRole.setRole(role);
        newUserRole.setUser(user);
        // set composite id
        newUserRole.setId(new UserRoleId(user.getId(), role.getId()));
        userRoleDOA.save(newUserRole);
        return newUserRole;
    }

    @Override
    public void deleteRole(UserRoleId id) {
        boolean exists = userRoleDOA.existsById(id);
        if(!exists) {
            throw new RuntimeException("user role with ID " + id + " does not exist");
        }
        userRoleDOA.deleteById(id);
    }
}

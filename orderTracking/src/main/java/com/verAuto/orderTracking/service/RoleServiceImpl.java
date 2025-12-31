package com.verAuto.orderTracking.service;


import com.verAuto.orderTracking.dao.RoleDAO;
import com.verAuto.orderTracking.dao.UserDAO;
import com.verAuto.orderTracking.entity.Role;
import com.verAuto.orderTracking.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {
    private final UserDAO userDAO;
    private RoleDAO roleDAO;
    @Autowired
    public RoleServiceImpl(RoleDAO roleDAO, UserDAO userDAO) {
        this.roleDAO = roleDAO;
        this.userDAO = userDAO;
    }
    @Override
    public List<Role> findAll() {
        return roleDAO.findAll();
    }

    @Override
    public Role findRoleById(int id) {
        return roleDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("could not find a role with the id - " + id));
    }


    @Override
    public Role saveRole(Role role) {
        return roleDAO.save(role);
    }

    @Override
    public void deleteById(int id) {
        boolean exists = roleDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("Role with ID " + id + " does not exist");
        }
        roleDAO.deleteById(id);
    }
}

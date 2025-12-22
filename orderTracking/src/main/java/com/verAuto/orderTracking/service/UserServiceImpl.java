package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.UserDAO;
import com.verAuto.orderTracking.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService{
    private UserDAO userDAO;

    @Autowired
    public UserServiceImpl( UserDAO userDAO ) {
        this.userDAO = userDAO;
    }
    @Override
    public List<User> findAll() {
        return userDAO.findAll();
    }

    @Override
    public User findById(int id) {
        return userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("could not find user with ths id - " + id));
    }
    @Override
    public User findUserByName(String name) {
        return userDAO.findByUserName(name);
    }

    @Override
    public User saveNewUser(User user) {
        user.setId(null);

        return userDAO.save(user);
    }

    @Override
    public void deleteUserById(int id) {
        boolean exists = userDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("user with ID " + id + " does not exist");
        }
        userDAO.deleteById(id);
    }
}

package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.UserDTO;
import com.verAuto.orderTracking.dao.CompanyDAO;
import com.verAuto.orderTracking.dao.UserDAO;
import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService{
    private final UserDAO userDAO;
    private final CompanyDAO companyDAO;
    private final CityService cityService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserDAO userDAO, CompanyDAO companyDAO, CityService cityService, BCryptPasswordEncoder passwordEncoder) {
        this.companyDAO = companyDAO;
        this.userDAO = userDAO;
        this.cityService = cityService;
        this.passwordEncoder = passwordEncoder;
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
        return userDAO.findByUserName(name)
                .orElseThrow(() -> new UsernameNotFoundException("User not found after auth"));
    }

    @Override
    public List<Company> getUserCompany(int id) {

        return companyDAO.findAllByUserId(id);
    }

    @Override
    public User saveNewUser(UserDTO user) {
        User newUser = new User();
        if (userDAO.existsByUserName(user.getUsername())) {
            // Throw a custom exception or a built-in one
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom d'utilisateur existe déjà");
        }
        newUser.setUserName(user.getUsername());
        newUser.setCity(cityService.findCityById(user.getCityId()));
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));

        return userDAO.save(newUser);
    }

    @Override
    public User updateUser(UserDTO user) {
        return null;
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

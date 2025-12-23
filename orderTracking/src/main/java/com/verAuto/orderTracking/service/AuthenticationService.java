package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.AuthRequest;
import com.verAuto.orderTracking.dao.UserDAO;
import com.verAuto.orderTracking.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserDAO userDAO;

    private final AuthenticationManager authenticationManager;


    public AuthenticationService(UserDAO userDAO, AuthenticationManager authenticationManager) {
        this.userDAO = userDAO;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public User authenticate(AuthRequest input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getUsername(),
                        input.getPassword()
                )
        );

        return userDAO.findByUserName(input.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found after auth"));
    }
}

package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController( UserService userService) {
        this.userService = userService;
    }


    @GetMapping
    public ResponseEntity<List<User>> findAllUsers() {
        return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        user.setId(null);
        return new ResponseEntity<>(userService.saveNewUser(user), HttpStatus.CREATED);
    }
}

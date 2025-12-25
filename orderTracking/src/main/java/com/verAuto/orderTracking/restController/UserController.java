package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.entity.Company;
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

    @GetMapping("/{id}/companies")
    public ResponseEntity<List<Company>> findUserCompanies(@PathVariable int id) {
        return new ResponseEntity<>(userService.getUserCompany(id), HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        user.setId(null);
        return new ResponseEntity<>(userService.saveNewUser(user), HttpStatus.CREATED);
    }
}

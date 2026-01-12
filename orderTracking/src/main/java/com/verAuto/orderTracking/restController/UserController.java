package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.UserDTO;
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

    @GetMapping("/{id}")
    public ResponseEntity<User> findUserById(@PathVariable int id) {
        return new ResponseEntity<>(userService.findById(id), HttpStatus.OK);
    }

    @GetMapping("/{id}/companies")
    public ResponseEntity<List<Company>> findUserCompanies(@PathVariable int id) {
        return new ResponseEntity<>(userService.getUserCompany(id), HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO user) {
        System.out.println("i'm heeeeer" + user);
        return new ResponseEntity<>(userService.saveNewUser(user), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable int id, @RequestBody UserDTO user) {
        System.out.println("i'm heeeeer" + user.isStatus());
        return new ResponseEntity<>(userService.updateUser(id, user), HttpStatus.OK);
    }
}

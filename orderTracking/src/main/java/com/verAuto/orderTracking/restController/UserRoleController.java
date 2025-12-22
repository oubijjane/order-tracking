package com.verAuto.orderTracking.restController;


import com.verAuto.orderTracking.DTO.CreatUserRole;
import com.verAuto.orderTracking.entity.UserRole;
import com.verAuto.orderTracking.service.UserRoleService;
import com.verAuto.orderTracking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-roles")
public class UserRoleController {

    private UserRoleService userRoleService;

    @Autowired
    public UserRoleController (UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    @GetMapping
    public ResponseEntity<List<UserRole>> findAllUserRoles() {
        return new ResponseEntity<>(userRoleService.findAll(), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<UserRole> createUserRole(@RequestBody CreatUserRole userRole) {
        return new ResponseEntity<>(userRoleService.saveUserRole(userRole), HttpStatus.CREATED);
    }
}

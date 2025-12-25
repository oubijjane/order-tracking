package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.CreateUserCompany;
import com.verAuto.orderTracking.entity.UserCompany;
import com.verAuto.orderTracking.service.UserCompanyService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-company")
public class UserCompanyController {
    private final UserCompanyService userCompanyService;

    @Autowired
    public UserCompanyController(UserCompanyService userCompanyService) {
        this.userCompanyService = userCompanyService;
    }

    @GetMapping
    public ResponseEntity<List<UserCompany>> findAll() {
        return new ResponseEntity<>(userCompanyService.findAll(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<UserCompany> saveNewUserCompany(@RequestBody CreateUserCompany userCompany) {
        UserCompany savedUserCompany = userCompanyService.saveNewUserCompany(userCompany);

        return new ResponseEntity<>(savedUserCompany, HttpStatus.CREATED);

    }
}

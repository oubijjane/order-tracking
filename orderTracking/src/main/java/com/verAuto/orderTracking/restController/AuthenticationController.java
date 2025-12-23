package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.AuthRequest;
import com.verAuto.orderTracking.DTO.LoginResponse;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.service.AuthenticationService;
import com.verAuto.orderTracking.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody AuthRequest loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/login")
    public ResponseEntity<String> authenticate5() {


        return new ResponseEntity<>("hey", HttpStatus.OK);
    }
}

package com.imovlife.auth.controller;

import com.imovlife.auth.dto.AuthResponse;
import com.imovlife.auth.dto.LoginRequest;
import com.imovlife.auth.dto.RegisterRequest;
import com.imovlife.auth.dto.UserResponse;
import com.imovlife.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUser(@Valid @RequestBody RegisterRequest request) {
        return authService.createUser(request);
    }

    @GetMapping("/brokers")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> listBrokers() {
        return authService.listBrokers();
    }
}

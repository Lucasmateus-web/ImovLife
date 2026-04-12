package com.imovlife.auth.service;

import com.imovlife.auth.domain.User;
import com.imovlife.auth.dto.AuthResponse;
import com.imovlife.auth.dto.LoginRequest;
import com.imovlife.auth.dto.RegisterRequest;
import com.imovlife.auth.dto.UserResponse;
import com.imovlife.auth.repository.UserRepository;
import com.imovlife.property.domain.UserRole;
import com.imovlife.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("user-1");
        user.setName("Administrador");
        user.setEmail("admin@imovlife.com");
        user.setPassword("encoded-password");
        user.setRole(UserRole.ADMIN);
    }

    @Test
    void shouldLoginSuccessfully() {
        when(userRepository.findByEmailIgnoreCase("admin@imovlife.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "encoded-password")).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("jwt-token");

        AuthResponse response = authService.login(new LoginRequest("admin@imovlife.com", "123456"));

        assertEquals("jwt-token", response.token());
        assertEquals(UserRole.ADMIN, response.role());
        assertEquals("user-1", response.userId());
    }

    @Test
    void shouldRejectInvalidPassword() {
        when(userRepository.findByEmailIgnoreCase("admin@imovlife.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("errada", "encoded-password")).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> authService.login(new LoginRequest("admin@imovlife.com", "errada")));
    }

    @Test
    void shouldRegisterClient() {
        RegisterRequest request = new RegisterRequest("Cliente Demo", "cliente@imovlife.com", "123456", UserRole.CLIENTE);
        when(userRepository.existsByEmailIgnoreCase("cliente@imovlife.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId("client-1");
            return saved;
        });

        UserResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("client-1", response.id());
        assertEquals(UserRole.CLIENTE, response.role());
    }
}

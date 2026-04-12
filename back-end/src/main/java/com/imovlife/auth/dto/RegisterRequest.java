package com.imovlife.auth.dto;

import com.imovlife.property.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min = 3) String name,
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6) String password,
        @NotNull UserRole role
) {
}

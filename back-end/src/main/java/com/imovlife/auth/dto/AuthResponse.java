package com.imovlife.auth.dto;

import com.imovlife.property.domain.UserRole;

public record AuthResponse(
        String token,
        String name,
        String email,
        UserRole role,
        String userId
) {
}

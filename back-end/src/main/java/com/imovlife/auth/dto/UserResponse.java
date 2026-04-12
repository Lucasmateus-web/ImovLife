package com.imovlife.auth.dto;

import com.imovlife.property.domain.UserRole;

public record UserResponse(
        String id,
        String name,
        String email,
        UserRole role
) {
}

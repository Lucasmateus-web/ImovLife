package com.imovlife.property.dto;

public record ToggleFavoriteResponse(
        String propertyId,
        boolean favorite
) {
}

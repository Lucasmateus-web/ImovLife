package com.imovlife.property.dto;

import java.util.List;

public record PropertyPageResponse(
        List<PropertyResponse> content,
        int totalPages,
        long totalElements,
        int size,
        int number
) {
}

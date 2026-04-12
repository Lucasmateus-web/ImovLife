package com.imovlife.property.dto;

import com.imovlife.property.domain.PropertyMode;
import com.imovlife.property.domain.PropertyStatus;
import com.imovlife.property.domain.PropertyType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PropertyResponse(
        String id,
        String title,
        PropertyType type,
        PropertyMode mode,
        BigDecimal price,
        BigDecimal condo,
        BigDecimal iptu,
        Integer bedrooms,
        Integer bathrooms,
        Integer parking,
        Integer size,
        String city,
        String neighborhood,
        String address,
        String description,
        List<String> features,
        String imageUrl,
        List<String> imageUrls,
        boolean isExclusive,
        PropertyStatus status,
        String brokerId,
        String brokerName,
        LocalDateTime createdAt,
        boolean favorite
) {
}

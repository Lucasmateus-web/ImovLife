package com.imovlife.property.dto;

import com.imovlife.property.domain.PropertyMode;
import com.imovlife.property.domain.PropertyStatus;
import com.imovlife.property.domain.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record PropertyRequest(
        @NotBlank String title,
        @NotNull PropertyType type,
        @NotNull PropertyMode mode,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @NotNull @DecimalMin("0.0") BigDecimal condo,
        @NotNull @DecimalMin("0.0") BigDecimal iptu,
        @NotNull @Min(0) Integer bedrooms,
        @NotNull @Min(0) Integer bathrooms,
        @NotNull @Min(0) Integer parking,
        @NotNull @Min(1) Integer size,
        @NotBlank String city,
        @NotBlank String neighborhood,
        @NotBlank String address,
        @NotBlank @Size(min = 20) String description,
        List<String> features,
        @NotEmpty List<String> imageUrls,
        boolean exclusive,
        @NotNull PropertyStatus status,
        String brokerId,
        String brokerName
) {
}

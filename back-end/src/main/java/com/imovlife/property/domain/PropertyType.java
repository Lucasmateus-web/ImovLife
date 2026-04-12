package com.imovlife.property.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum PropertyType {
    APARTAMENTO("Apartamento"),
    CASA("Casa"),
    COMERCIAL("Comercial"),
    TERRENO("Terreno");

    private final String label;

    PropertyType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static PropertyType fromValue(String value) {
        return Arrays.stream(values())
                .filter(type -> type.name().equalsIgnoreCase(value) || type.label.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tipo de imóvel inválido: " + value));
    }
}

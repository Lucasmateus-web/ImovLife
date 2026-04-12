package com.imovlife.property.controller;

import com.imovlife.property.domain.PropertyType;
import com.imovlife.property.dto.PropertyPageResponse;
import com.imovlife.property.dto.PropertyRequest;
import com.imovlife.property.dto.PropertyResponse;
import com.imovlife.property.dto.ToggleFavoriteResponse;
import com.imovlife.property.service.PropertyService;
import com.imovlife.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public PropertyPageResponse list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) PropertyType type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(defaultValue = "recent") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal AuthenticatedUser currentUser
    ) {
        return propertyService.list(search, type, minPrice, maxPrice, minBedrooms, sort, page, size, currentUser);
    }

    @GetMapping("/{id}")
    public PropertyResponse findById(@PathVariable String id, @AuthenticationPrincipal AuthenticatedUser currentUser) {
        return propertyService.findById(id, currentUser);
    }

    @GetMapping("/favorites")
    public List<PropertyResponse> listFavorites(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return propertyService.listFavorites(currentUser);
    }

    @PostMapping
    public PropertyResponse create(@Valid @RequestBody PropertyRequest request, @AuthenticationPrincipal AuthenticatedUser currentUser) {
        return propertyService.create(request, currentUser);
    }

    @PutMapping("/{id}")
    public PropertyResponse update(@PathVariable String id, @Valid @RequestBody PropertyRequest request,
                                   @AuthenticationPrincipal AuthenticatedUser currentUser) {
        return propertyService.update(id, request, currentUser);
    }

    @PatchMapping("/{id}/toggle-status")
    public PropertyResponse toggleStatus(@PathVariable String id, @AuthenticationPrincipal AuthenticatedUser currentUser) {
        return propertyService.toggleStatus(id, currentUser);
    }

    @PatchMapping("/{id}/favorite")
    public ToggleFavoriteResponse toggleFavorite(@PathVariable String id, @AuthenticationPrincipal AuthenticatedUser currentUser) {
        return propertyService.toggleFavorite(id, currentUser);
    }
}

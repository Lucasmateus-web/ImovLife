package com.imovlife.property.service;

import com.imovlife.auth.domain.User;
import com.imovlife.auth.dto.RegisterRequest;
import com.imovlife.auth.service.AuthService;
import com.imovlife.property.domain.Favorite;
import com.imovlife.property.domain.Property;
import com.imovlife.property.domain.PropertyMode;
import com.imovlife.property.domain.PropertyStatus;
import com.imovlife.property.domain.PropertyType;
import com.imovlife.property.domain.UserRole;
import com.imovlife.property.dto.PropertyPageResponse;
import com.imovlife.property.dto.PropertyRequest;
import com.imovlife.property.dto.PropertyResponse;
import com.imovlife.property.dto.ToggleFavoriteResponse;
import com.imovlife.property.repository.FavoriteRepository;
import com.imovlife.property.repository.PropertyRepository;
import com.imovlife.security.AuthenticatedUser;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final FavoriteRepository favoriteRepository;
    private final AuthService authService;

    public PropertyService(PropertyRepository propertyRepository, FavoriteRepository favoriteRepository, AuthService authService) {
        this.propertyRepository = propertyRepository;
        this.favoriteRepository = favoriteRepository;
        this.authService = authService;
    }

    @PostConstruct
    @Transactional
    void seed() {
        if (!propertyRepository.findAll().isEmpty()) {
            return;
        }

        User admin = ensureUser("Administrador", "admin@imovlife.com", "123456", UserRole.ADMIN);
        User brokerOne = ensureUser("Mariana Costa", "corretor@imovlife.com", "123456", UserRole.CORRETOR);
        User brokerTwo = ensureUser("Felipe Duarte", "corretor2@imovlife.com", "123456", UserRole.CORRETOR);
        ensureUser("Cliente Demo", "cliente@imovlife.com", "123456", UserRole.CLIENTE);

        propertyRepository.save(buildSeed(
                "Cobertura vista mar em Boa Viagem",
                PropertyType.APARTAMENTO,
                PropertyMode.VENDA,
                new BigDecimal("1250000"),
                new BigDecimal("1800"),
                new BigDecimal("540"),
                4,
                4,
                3,
                220,
                "Recife",
                "Boa Viagem",
                "Av. Boa Viagem, 1000",
                "Cobertura alto padrão com varanda gourmet, automação e vista definitiva para o mar.",
                List.of("Piscina", "Varanda Gourmet", "Portaria 24h"),
                List.of(
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
                ),
                true,
                PropertyStatus.ATIVO,
                brokerOne
        ));

        propertyRepository.save(buildSeed(
                "Casa térrea com quintal em Apipucos",
                PropertyType.CASA,
                PropertyMode.ALUGUEL,
                new BigDecimal("6500"),
                BigDecimal.ZERO,
                new BigDecimal("320"),
                3,
                2,
                2,
                180,
                "Recife",
                "Apipucos",
                "Rua das Mangueiras, 45",
                "Casa confortável com jardim amplo, iluminação natural e perfil ideal para famílias.",
                List.of("Jardim", "Quintal", "Pet friendly"),
                List.of(
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
                        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                ),
                false,
                PropertyStatus.ATIVO,
                brokerTwo
        ));
    }

    @Transactional(readOnly = true)
    public PropertyPageResponse list(String search, PropertyType type, BigDecimal minPrice, BigDecimal maxPrice,
                                     Integer minBedrooms, String sort, int page, int size, AuthenticatedUser currentUser) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), resolveSort(sort));

        Specification<Property> specification = (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                predicates.add(builder.or(
                        builder.like(builder.lower(root.get("title")), like),
                        builder.like(builder.lower(root.get("city")), like),
                        builder.like(builder.lower(root.get("neighborhood")), like)
                ));
            }

            if (type != null) {
                predicates.add(builder.equal(root.get("type"), type));
            }
            if (minPrice != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(builder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (minBedrooms != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("bedrooms"), minBedrooms));
            }
            if (currentUser == null || currentUser.getRole() == UserRole.CLIENTE) {
                predicates.add(builder.equal(root.get("status"), PropertyStatus.ATIVO));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Property> result = propertyRepository.findAll(specification, pageable);
        Set<String> favorites = resolveFavoriteIds(currentUser);

        return new PropertyPageResponse(
                result.getContent().stream().map(property -> toResponse(property, favorites.contains(property.getId()))).toList(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.getSize(),
                result.getNumber()
        );
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> listFavorites(AuthenticatedUser currentUser) {
        User user = requireCurrentUser(currentUser);
        return favoriteRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(Favorite::getProperty)
                .map(property -> toResponse(property, true))
                .toList();
    }

    @Transactional(readOnly = true)
    public PropertyResponse findById(String id, AuthenticatedUser currentUser) {
        Property property = findEntityById(id);
        boolean favorite = currentUser != null && currentUser.getRole() == UserRole.CLIENTE
                && favoriteRepository.existsByUserAndProperty(requireCurrentUser(currentUser), property);
        return toResponse(property, favorite);
    }

    @Transactional
    public PropertyResponse create(PropertyRequest request, AuthenticatedUser currentUser) {
        User current = requireCurrentUser(currentUser);
        ensureManagementRole(current);

        User broker = resolveBrokerForWrite(request.brokerId(), current);
        Property property = new Property();
        applyRequest(property, request, broker);
        return toResponse(propertyRepository.save(property), false);
    }

    @Transactional
    public PropertyResponse update(String id, PropertyRequest request, AuthenticatedUser currentUser) {
        User current = requireCurrentUser(currentUser);
        ensureManagementRole(current);

        Property property = findEntityById(id);
        ensureCanManageProperty(current, property);

        User broker = resolveBrokerForWrite(request.brokerId(), current);
        applyRequest(property, request, broker);
        return toResponse(propertyRepository.save(property), false);
    }

    @Transactional
    public PropertyResponse toggleStatus(String id, AuthenticatedUser currentUser) {
        User current = requireCurrentUser(currentUser);
        ensureManagementRole(current);

        Property property = findEntityById(id);
        ensureCanManageProperty(current, property);
        property.setStatus(property.getStatus() == PropertyStatus.ATIVO ? PropertyStatus.INATIVO : PropertyStatus.ATIVO);
        return toResponse(propertyRepository.save(property), false);
    }

    @Transactional
    public ToggleFavoriteResponse toggleFavorite(String id, AuthenticatedUser currentUser) {
        User user = requireCurrentUser(currentUser);
        if (user.getRole() != UserRole.CLIENTE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente clientes podem favoritar imóveis.");
        }

        Property property = findEntityById(id);
        Favorite favorite = favoriteRepository.findByUserAndProperty(user, property).orElse(null);

        if (favorite != null) {
            favoriteRepository.delete(favorite);
            return new ToggleFavoriteResponse(id, false);
        }

        Favorite newFavorite = new Favorite();
        newFavorite.setUser(user);
        newFavorite.setProperty(property);
        favoriteRepository.save(newFavorite);
        return new ToggleFavoriteResponse(id, true);
    }

    @Transactional(readOnly = true)
    public Property findEntityById(String id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imóvel não encontrado."));
    }

    private void applyRequest(Property property, PropertyRequest request, User broker) {
        property.setTitle(request.title().trim());
        property.setType(request.type());
        property.setMode(request.mode());
        property.setPrice(request.price());
        property.setCondo(request.condo());
        property.setIptu(request.iptu());
        property.setBedrooms(request.bedrooms());
        property.setBathrooms(request.bathrooms());
        property.setParking(request.parking());
        property.setSize(request.size());
        property.setCity(request.city().trim());
        property.setNeighborhood(request.neighborhood().trim());
        property.setAddress(request.address().trim());
        property.setDescription(request.description().trim());
        property.setFeatures(request.features() == null ? List.of() : request.features().stream().filter(item -> item != null && !item.isBlank()).map(String::trim).toList());
        property.setImageUrls(request.imageUrls().stream().filter(item -> item != null && !item.isBlank()).map(String::trim).toList());
        property.setExclusive(request.exclusive());
        property.setStatus(request.status());
        property.setBroker(broker);
    }

    private Sort resolveSort(String sort) {
        return switch (sort == null ? "recent" : sort) {
            case "price-asc" -> Sort.by("price").ascending();
            case "price-desc" -> Sort.by("price").descending();
            case "bedrooms-desc" -> Sort.by("bedrooms").descending();
            case "title-asc" -> Sort.by("title").ascending();
            default -> Sort.by("createdAt").descending();
        };
    }

    private User ensureUser(String name, String email, String rawPassword, UserRole role) {
        return authService.findByEmail(email)
                .orElseGet(() -> authService.findById(
                        authService.createUser(new RegisterRequest(name, email, rawPassword, role)).id()
                ));
    }

    private User resolveBrokerForWrite(String requestedBrokerId, User currentUser) {
        if (currentUser.getRole() == UserRole.CORRETOR) {
            return currentUser;
        }
        if (requestedBrokerId == null || requestedBrokerId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecione um corretor para o imóvel.");
        }
        User broker = authService.findById(requestedBrokerId);
        if (broker.getRole() != UserRole.CORRETOR) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O usuário informado não é um corretor.");
        }
        return broker;
    }

    private void ensureManagementRole(User user) {
        if (user.getRole() == UserRole.CLIENTE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Clientes não podem gerenciar imóveis.");
        }
    }

    private void ensureCanManageProperty(User user, Property property) {
        if (user.getRole() == UserRole.ADMIN) {
            return;
        }
        if (!property.getBroker().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você só pode gerenciar imóveis criados por você.");
        }
    }

    private User requireCurrentUser(AuthenticatedUser currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado.");
        }
        return authService.findById(currentUser.getId());
    }

    private Set<String> resolveFavoriteIds(AuthenticatedUser currentUser) {
        if (currentUser == null || currentUser.getRole() != UserRole.CLIENTE) {
            return Set.of();
        }
        User user = requireCurrentUser(currentUser);
        return favoriteRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(favorite -> favorite.getProperty().getId())
                .collect(java.util.stream.Collectors.toSet());
    }

    private PropertyResponse toResponse(Property property, boolean favorite) {
        List<String> imageUrls = property.getImageUrls() == null ? List.of() : property.getImageUrls();
        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getType(),
                property.getMode(),
                property.getPrice(),
                property.getCondo(),
                property.getIptu(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getParking(),
                property.getSize(),
                property.getCity(),
                property.getNeighborhood(),
                property.getAddress(),
                property.getDescription(),
                property.getFeatures(),
                imageUrls.isEmpty() ? "" : imageUrls.get(0),
                imageUrls,
                property.isExclusive(),
                property.getStatus(),
                property.getBroker().getId(),
                property.getBroker().getName(),
                property.getCreatedAt(),
                favorite
        );
    }

    private Property buildSeed(String title, PropertyType type, PropertyMode mode, BigDecimal price, BigDecimal condo,
                               BigDecimal iptu, Integer bedrooms, Integer bathrooms, Integer parking, Integer size,
                               String city, String neighborhood, String address, String description, List<String> features,
                               List<String> imageUrls, boolean exclusive, PropertyStatus status, User broker) {
        Property property = new Property();
        property.setTitle(title);
        property.setType(type);
        property.setMode(mode);
        property.setPrice(price);
        property.setCondo(condo);
        property.setIptu(iptu);
        property.setBedrooms(bedrooms);
        property.setBathrooms(bathrooms);
        property.setParking(parking);
        property.setSize(size);
        property.setCity(city);
        property.setNeighborhood(neighborhood);
        property.setAddress(address);
        property.setDescription(description);
        property.setFeatures(features);
        property.setImageUrls(imageUrls);
        property.setExclusive(exclusive);
        property.setStatus(status);
        property.setBroker(broker);
        return property;
    }
}

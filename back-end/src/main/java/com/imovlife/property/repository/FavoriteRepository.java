package com.imovlife.property.repository;

import com.imovlife.auth.domain.User;
import com.imovlife.property.domain.Favorite;
import com.imovlife.property.domain.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, String> {
    Optional<Favorite> findByUserAndProperty(User user, Property property);
    List<Favorite> findByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserAndProperty(User user, Property property);
}

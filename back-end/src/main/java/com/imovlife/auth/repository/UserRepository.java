package com.imovlife.auth.repository;

import com.imovlife.auth.domain.User;
import com.imovlife.property.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmailIgnoreCase(String email);
    List<User> findByRoleOrderByNameAsc(UserRole role);
    boolean existsByEmailIgnoreCase(String email);
}

package com.imovlife.property.repository;

import com.imovlife.auth.domain.User;
import com.imovlife.property.domain.Property;
import com.imovlife.property.domain.PropertyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, String>, JpaSpecificationExecutor<Property> {
    List<Property> findByBrokerOrderByCreatedAtDesc(User broker);
    List<Property> findByStatusOrderByCreatedAtDesc(PropertyStatus status);
}

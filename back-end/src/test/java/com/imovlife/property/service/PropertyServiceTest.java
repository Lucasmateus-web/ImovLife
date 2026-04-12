package com.imovlife.property.service;

import com.imovlife.auth.domain.User;
import com.imovlife.auth.service.AuthService;
import com.imovlife.property.domain.Property;
import com.imovlife.property.domain.PropertyMode;
import com.imovlife.property.domain.PropertyStatus;
import com.imovlife.property.domain.PropertyType;
import com.imovlife.property.domain.UserRole;
import com.imovlife.property.dto.PropertyRequest;
import com.imovlife.property.repository.FavoriteRepository;
import com.imovlife.property.repository.PropertyRepository;
import com.imovlife.security.AuthenticatedUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private PropertyService propertyService;

    private User broker;
    private Property property;
    private AuthenticatedUser anotherBroker;

    @BeforeEach
    void setUp() {
        broker = new User();
        broker.setId("broker-1");
        broker.setName("Mariana Costa");
        broker.setEmail("corretor@imovlife.com");
        broker.setRole(UserRole.CORRETOR);

        property = new Property();
        property.setId("property-1");
        property.setBroker(broker);
        property.setStatus(PropertyStatus.ATIVO);

        anotherBroker = new AuthenticatedUser("broker-2", "Outro Corretor", "outro@imovlife.com", "secret", UserRole.CORRETOR);
    }

    @Test
    void shouldBlockBrokerFromUpdatingAnotherBrokerProperty() {
        PropertyRequest request = new PropertyRequest(
                "Apartamento novo",
                PropertyType.APARTAMENTO,
                PropertyMode.VENDA,
                new BigDecimal("1000000"),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                3,
                2,
                2,
                100,
                "Recife",
                "Boa Viagem",
                "Rua Teste",
                "Descrição com tamanho suficiente para validação do imóvel no sistema.",
                List.of("Piscina"),
                List.of("https://teste.com/foto.jpg"),
                true,
                PropertyStatus.ATIVO,
                "broker-2",
                null
        );

        User otherUser = new User();
        otherUser.setId("broker-2");
        otherUser.setRole(UserRole.CORRETOR);
        otherUser.setName("Outro Corretor");

        when(authService.findById("broker-2")).thenReturn(otherUser);
        when(propertyRepository.findById("property-1")).thenReturn(java.util.Optional.of(property));

        assertThrows(ResponseStatusException.class, () -> propertyService.update("property-1", request, anotherBroker));
    }
}

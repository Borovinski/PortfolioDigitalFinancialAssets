package com.borovinski;

import com.borovinski.model.Coin;
import com.borovinski.repository.CoinRepository;
import com.borovinski.service.KeyBusinessLogic.PriceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PriceServiceImplTest {

    @Mock
    private CoinRepository coinRepository;

    @InjectMocks
    private PriceServiceImpl priceService;

    @BeforeEach
    void setup() {
        priceService = new PriceServiceImpl(coinRepository);
    }

    @Test
    void testGetCurrentPriceReturnsCorrectValue() {
        Coin btc = new Coin();
        btc.setSymbol("btc");
        btc.setCurrentPrice(31000.0);

        when(coinRepository.findBySymbol("btc")).thenReturn(Optional.of(btc));

        BigDecimal price = priceService.getCurrentPrice("btc");

        assertEquals(0, price.compareTo(BigDecimal.valueOf(31000.0)));
    }

    @Test
    void testGetCurrentPriceThrowsIfCoinNotFound() {
        when(coinRepository.findBySymbol("unknown"))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> priceService.getCurrentPrice("unknown"));

        assertTrue(exception.getMessage().contains("Монета не найдена"));
    }
}

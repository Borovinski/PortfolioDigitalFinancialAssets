package com.borovinski;

import com.borovinski.model.Coin;
import com.borovinski.repository.CoinRepository;
import com.borovinski.service.CoinApi.CoinServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CoinServiceImplTest {

    @Mock
    private CoinRepository coinRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private CoinServiceImpl coinService;

    private Coin sampleCoin;

    @BeforeEach
    void setUp() {
        sampleCoin = new Coin();
        sampleCoin.setId("bitcoin");
        sampleCoin.setSymbol("btc");
        sampleCoin.setName("Bitcoin");
    }

    @Test
    void testFindByIdReturnsCoin() throws Exception {
        when(coinRepository.findById("bitcoin")).thenReturn(Optional.of(sampleCoin));

        Coin result = coinService.findById("bitcoin");

        assertNotNull(result);
        assertEquals("btc", result.getSymbol());
    }

    @Test
    void testFindByIdThrowsException() {
        when(coinRepository.findById("invalid-id")).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> coinService.findById("invalid-id"));

        assertTrue(exception.getMessage().contains("invalid coin id"));
    }

    @Test
    void testFindBySymbolReturnsCoin() throws Exception {
        when(coinRepository.findBySymbolIgnoreCase("btc")).thenReturn(Optional.of(sampleCoin));

        Coin result = coinService.findBySymbol("btc");

        assertNotNull(result);
        assertEquals("btc", result.getSymbol());
    }

    @Test
    void testFindBySymbolThrowsException() {
        when(coinRepository.findBySymbolIgnoreCase("xxx")).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> coinService.findBySymbol("xxx"));

        assertTrue(exception.getMessage().contains("Coin not found with symbol"));
    }
}

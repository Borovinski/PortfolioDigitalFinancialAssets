package com.borovinski.service.KeyBusinessLogic;

import com.borovinski.model.Coin;
import com.borovinski.repository.CoinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PriceServiceImpl implements PriceService {

    private final CoinRepository coinRepository;

    @Override
    public BigDecimal getCurrentPrice(String symbol) {
        return coinRepository.findBySymbol(symbol.toLowerCase())
                .map(coin -> BigDecimal.valueOf(coin.getCurrentPrice()))
                .orElseThrow(() -> new RuntimeException("Монета не найдена: " + symbol));
    }
}


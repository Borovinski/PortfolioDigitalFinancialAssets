package com.borovinski.response.PortfolioBusinessLogic;

import java.math.BigDecimal;

public record CoinProfitabilityDTO(
        String symbol,
        BigDecimal quantity,
        BigDecimal buyPrice,
        BigDecimal currentPrice,
        BigDecimal invested,
        BigDecimal current,
        BigDecimal profit,
        BigDecimal profitPercent
) {}

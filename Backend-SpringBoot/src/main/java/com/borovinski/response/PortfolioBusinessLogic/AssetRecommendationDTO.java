package com.borovinski.response.PortfolioBusinessLogic;

import java.math.BigDecimal;

public record AssetRecommendationDTO(String symbol,
                                     BigDecimal currentPercent,
                                     BigDecimal targetPercent,
                                     BigDecimal difference) {
}

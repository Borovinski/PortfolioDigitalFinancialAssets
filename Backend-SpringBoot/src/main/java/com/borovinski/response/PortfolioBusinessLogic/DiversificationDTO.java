package com.borovinski.response.PortfolioBusinessLogic;

import java.math.BigDecimal;

public record DiversificationDTO(String symbol,
                                 BigDecimal currentValue,
                                 BigDecimal percentage) {
}

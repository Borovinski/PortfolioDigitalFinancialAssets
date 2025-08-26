package com.borovinski.service.KeyBusinessLogic;

import java.math.BigDecimal;

public interface PriceService {

    BigDecimal getCurrentPrice(String symbol);
}

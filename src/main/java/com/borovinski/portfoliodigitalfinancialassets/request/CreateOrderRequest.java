package com.borovinski.portfoliodigitalfinancialassets.request;

import com.borovinski.portfoliodigitalfinancialassets.domain.OrderType;
import lombok.Data;

@Data
public class CreateOrderRequest {
    private String coinId;
    private double quantity;
    private OrderType orderType;
}

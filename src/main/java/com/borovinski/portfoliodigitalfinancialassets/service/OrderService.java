package com.borovinski.portfoliodigitalfinancialassets.service;

import com.borovinski.portfoliodigitalfinancialassets.domain.OrderType;
import com.borovinski.portfoliodigitalfinancialassets.model.Coin;
import com.borovinski.portfoliodigitalfinancialassets.model.Order;
import com.borovinski.portfoliodigitalfinancialassets.model.OrderItem;
import com.borovinski.portfoliodigitalfinancialassets.model.User;

import java.util.List;

public interface OrderService {

    Order createOrder(User user, OrderItem orderItem, OrderType orderType);

    Order getOrderById(Long orderId) throws Exception;

    List<Order> getAllOrdersOfUser(Long userId, OrderType orderType, String assetSymbol);

    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;
}

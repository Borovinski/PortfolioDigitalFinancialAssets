package com.borovinski.service.BuyCoin;

import com.borovinski.domain.OrderType;
import com.borovinski.model.Coin;
import com.borovinski.model.Order;
import com.borovinski.model.OrderItem;
import com.borovinski.model.User;


import java.util.List;

public interface OrderService {

    Order createOrder(User user, OrderItem orderItem, OrderType orderType);

    Order getOrderById(Long orderId);

    List<Order> getAllOrdersForUser(Long userId, String orderType, String assetSymbol);

    void cancelOrder(Long orderId);

//    Order buyAsset(CreateOrderRequest req, Long userId, String jwt) throws Exception;

    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;

//    Order sellAsset(CreateOrderRequest req,Long userId,String jwt) throws Exception;

    Order buyAsset(Coin coin, double quantity, User user) throws Exception;

    Order sellAsset(Coin coin, double quantity, User user) throws Exception;
}

package com.borovinski.portfoliodigitalfinancialassets.controller;

import com.borovinski.portfoliodigitalfinancialassets.domain.OrderType;
import com.borovinski.portfoliodigitalfinancialassets.model.Coin;
import com.borovinski.portfoliodigitalfinancialassets.model.Order;
import com.borovinski.portfoliodigitalfinancialassets.model.User;
import com.borovinski.portfoliodigitalfinancialassets.request.CreateOrderRequest;
import com.borovinski.portfoliodigitalfinancialassets.service.CoinService;
import com.borovinski.portfoliodigitalfinancialassets.service.OrderService;
import com.borovinski.portfoliodigitalfinancialassets.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;

//    @Autowired
//    private WalletTransactionService walletTransactionService;

    @PostMapping("/pay")
    public ResponseEntity<Order> payOrderPayment(
            @RequestHeader("Authorization") String jwt,
            @RequestBody CreateOrderRequest req
    ) throws Exception {
        User user = userService.findUserProfileByJWT(jwt);
        Coin coin = coinService.findById(req.getCoinId());

        Order order = orderService.processOrder(coin, req.getQuantity(), req.getOrderType(), user); //Здесь не знаю

        return ResponseEntity.ok(order);

    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable Long orderId
    ) throws Exception {

        User user = userService.findUserProfileByJWT(jwtToken);

        Order order = orderService.getOrderById(orderId);
        if (order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok(order);
        } else {
            throw new Exception("you don't have access!");
        }
    }

    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrdersForUsers(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(required = false) OrderType order_type,
            @RequestParam(required = false) String asset_symbol
    ) throws Exception {
        Long userId = userService.findUserProfileByJWT(jwt).getId();

        List<Order> userOrders = orderService.getAllOrdersOfUser(userId, order_type, asset_symbol);
        return ResponseEntity.ok(userOrders);
    }


}

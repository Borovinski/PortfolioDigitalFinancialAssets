package com.borovinski.controller.Cards;

import com.borovinski.domain.PaymentMethod;
import com.borovinski.model.PaymentOrder;
import com.borovinski.model.User;
import com.borovinski.response.PaymentResponse;
import com.borovinski.service.BankCard.PaymentService;
import com.borovinski.service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(
            @PathVariable PaymentMethod paymentMethod,
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        PaymentResponse paymentResponse;

        PaymentOrder order = paymentService.createOrder(user, amount, paymentMethod);

        switch (paymentMethod) {
            case PADDLE -> paymentResponse = paymentService.createPaddlePaymentLink(user, amount, order.getId());
            case STRIPE -> paymentResponse = paymentService.createStripePaymentLink(user, amount, order.getId());
            default -> throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        }

        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }

}

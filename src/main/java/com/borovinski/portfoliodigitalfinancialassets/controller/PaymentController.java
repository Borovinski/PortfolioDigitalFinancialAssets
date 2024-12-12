package com.borovinski.portfoliodigitalfinancialassets.controller;

import com.borovinski.portfoliodigitalfinancialassets.domain.PaymentMethod;
import com.borovinski.portfoliodigitalfinancialassets.model.PaymentOrder;
import com.borovinski.portfoliodigitalfinancialassets.model.User;
import com.borovinski.portfoliodigitalfinancialassets.response.PaymentResponse;
import com.borovinski.portfoliodigitalfinancialassets.service.PaymentService;
import com.borovinski.portfoliodigitalfinancialassets.service.UserService;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PaymentController {
    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("api/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(
            @PathVariable PaymentMethod paymentMethod,
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt) throws
            Exception,
            RazorpayException,
            StripeException {

        User user = userService.findUserProfileByJWT(jwt);

        PaymentResponse paymentResponse;

        PaymentOrder order = paymentService.createOrder(user,amount,paymentMethod);

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)){
            paymentResponse = paymentService.createRazorpayPaymentLing(user,amount);

        }
        else{
            paymentResponse = paymentService.createStripePaymentLing(user,amount,order.getId());
        }

        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);

    }

}

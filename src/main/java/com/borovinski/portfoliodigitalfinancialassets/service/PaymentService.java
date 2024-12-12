package com.borovinski.portfoliodigitalfinancialassets.service;

import com.borovinski.portfoliodigitalfinancialassets.domain.PaymentMethod;
import com.borovinski.portfoliodigitalfinancialassets.model.PaymentOrder;
import com.borovinski.portfoliodigitalfinancialassets.model.User;
import com.borovinski.portfoliodigitalfinancialassets.response.PaymentResponse;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;

public interface PaymentService {

    PaymentOrder createOrder(User user, Long amount,
                             PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean ProccedPaymentOrder(PaymentOrder paymentOrder,
                                String paymentId) throws RazorpayException;

    PaymentResponse createRazorpayPaymentLing(User user, Long amount) throws RazorpayException;

    PaymentResponse createStripePaymentLing(User user, Long amount, Long orderId) throws StripeException;

}

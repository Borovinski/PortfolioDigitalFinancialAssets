package com.borovinski.service.BankCard;

import com.stripe.exception.StripeException;
import com.borovinski.domain.PaymentMethod;
import com.borovinski.model.PaymentOrder;
import com.borovinski.model.User;
import com.borovinski.response.PaymentResponse;

import java.io.IOException;

public interface PaymentService {

    PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean processedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws StripeException;

    PaymentResponse createStripePaymentLink(User user, Long Amount, Long orderId) throws StripeException;

    PaymentResponse createPaddlePaymentLink(User user, Long amount, Long orderId) throws IOException;

}


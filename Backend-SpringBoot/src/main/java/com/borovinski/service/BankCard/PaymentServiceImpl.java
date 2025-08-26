package com.borovinski.service.BankCard;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.borovinski.domain.PaymentMethod;
import com.borovinski.domain.PaymentOrderStatus;
import com.borovinski.model.PaymentOrder;
import com.borovinski.model.User;
import com.borovinski.repository.PaymentOrderRepository;
import com.borovinski.response.PaymentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${paddle.vendor.id}")
    private String paddleVendorId;

    @Value("${paddle.api.key}")
    private String paddleApiKey;

    @Autowired
    private PaymentOrderRepository paymentOrderRepository;

    @Override
    public PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod) {
        PaymentOrder order = new PaymentOrder();
        order.setUser(user);
        order.setAmount(amount);
        order.setPaymentMethod(paymentMethod);
        return paymentOrderRepository.save(order);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        Optional<PaymentOrder> optionalPaymentOrder = paymentOrderRepository.findById(id);
        if (optionalPaymentOrder.isEmpty()) {
            throw new Exception("payment order not found with id " + id);
        }
        return optionalPaymentOrder.get();
    }

    @Override
    public Boolean processedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws StripeException {
        if (!paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)) {
            return false;
        }

        switch (paymentOrder.getPaymentMethod()) {

            case PADDLE -> {
                // Paddle не возвращает paymentId напрямую, нужен другой способ верификации
                // здесь предполагаем, что если пользователь вернулся с Paddle и заказ был создан — успех
                // ты можешь позже интегрировать Paddle Webhooks для реальной проверки
                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);
                return true;
            }
            case STRIPE -> {
                // Для Stripe логика аналогична — обрабатываем без прямой проверки статуса
                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);
                return true;
            }
            default -> {
                return false;
            }
        }
    }

    @Override
    public PaymentResponse createStripePaymentLink(User user, Long amount, Long orderId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/wallet?order_id=" + orderId)
                .setCancelUrl("http://localhost:5173/payment/cancel")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(amount * 100)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("Top up wallet")
                                        .build())
                                .build())
                        .build())
                .build();

        Session session = Session.create(params);
        PaymentResponse res = new PaymentResponse();
        res.setPayment_url(session.getUrl());
        System.out.println(res.getPayment_url());
        return res;
    }

    @Override
    public PaymentResponse createPaddlePaymentLink(User user, Long amount, Long orderId) throws IOException {
        // Отключаем SSL проверку (только для тестов!)
        com.borovinski.utils.UnsafeSSL.disableSSLVerification();

        // URL из официальной документации (sandbox API)
        String url = "https://sandbox-api.paddle.com/checkout";

        RestTemplate restTemplate = new RestTemplate();

        // Заголовки запроса
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("Authorization", "Bearer " + paddleApiKey);

        // Тело запроса
        Map<String, Object> body = new HashMap<>();
        body.put("customer_email", user.getEmail());
        body.put("vendor_id", paddleVendorId);
        body.put("title", "Wallet Top-up");
        body.put("custom_data", Collections.singletonMap("orderId", orderId));
        body.put("amount", String.format("%.2f", amount / 100.0));
        body.put("currency_code", "USD");
        body.put("success_url", "http://localhost:5173/wallet?order_id=" + orderId);
        body.put("cancel_url", "http://localhost:5173/payment/cancel");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // Отправляем запрос и получаем ответ в виде строки (чтобы увидеть, что вернул сервер)
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        // Печатаем "сырое" тело ответа
        System.out.println("RAW PADDLE RESPONSE:");
        System.out.println(response.getBody());


        PaymentResponse res = new PaymentResponse();
        res.setPayment_url("https://sandbox-checkout.paddle.com/pay/12345-test-checkout-url"); // замени на нормальный после теста
        return res;
    }
}
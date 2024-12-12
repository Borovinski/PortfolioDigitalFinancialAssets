package com.borovinski.portfoliodigitalfinancialassets.model;

import com.borovinski.portfoliodigitalfinancialassets.domain.PaymentMethod;
import com.borovinski.portfoliodigitalfinancialassets.domain.PaymentOrderStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PaymentOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long amount;

    private PaymentOrderStatus status;

    private PaymentMethod paymentMethod;

    @ManyToOne
    private User user;

}

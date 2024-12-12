package com.borovinski.portfoliodigitalfinancialassets.repository;

import com.borovinski.portfoliodigitalfinancialassets.model.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
}

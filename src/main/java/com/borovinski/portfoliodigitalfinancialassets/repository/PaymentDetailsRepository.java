package com.borovinski.portfoliodigitalfinancialassets.repository;

import com.borovinski.portfoliodigitalfinancialassets.model.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, Long> {

    PaymentDetails findByUserId(Long userId);
}

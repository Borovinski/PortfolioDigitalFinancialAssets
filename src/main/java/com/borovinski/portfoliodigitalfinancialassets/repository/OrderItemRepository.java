package com.borovinski.portfoliodigitalfinancialassets.repository;

import com.borovinski.portfoliodigitalfinancialassets.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}

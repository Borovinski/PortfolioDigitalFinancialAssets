package com.borovinski.portfoliodigitalfinancialassets.repository;

import com.borovinski.portfoliodigitalfinancialassets.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    Wallet findByUserId(long userId);

}

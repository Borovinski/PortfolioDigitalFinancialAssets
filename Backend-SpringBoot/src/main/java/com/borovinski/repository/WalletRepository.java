package com.borovinski.repository;

import com.borovinski.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    public Wallet findByUserId(Long userId);


}

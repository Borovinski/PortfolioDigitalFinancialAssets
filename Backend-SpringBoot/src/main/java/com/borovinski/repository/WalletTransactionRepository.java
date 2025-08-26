package com.borovinski.repository;

import com.borovinski.domain.WalletTransactionType;
import com.borovinski.model.Wallet;
import com.borovinski.model.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByWalletOrderByDateDesc(Wallet wallet);

    boolean existsByWalletAndDateAndTypeAndAmount(
            Wallet wallet,
            LocalDate date,
            WalletTransactionType type,
            Long amount
    );
    boolean existsByTransferId(String transferId);
}

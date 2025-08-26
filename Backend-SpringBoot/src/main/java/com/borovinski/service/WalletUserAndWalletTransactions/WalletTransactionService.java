package com.borovinski.service.WalletUserAndWalletTransactions;

import com.borovinski.domain.WalletTransactionType;
import com.borovinski.model.Wallet;
import com.borovinski.model.WalletTransaction;

import java.util.List;

public interface WalletTransactionService {
    WalletTransaction createTransaction(Wallet wallet,
                                        WalletTransactionType type,
                                        String transferId,
                                        String purpose,
                                        Long amount
    );

    List<WalletTransaction> getTransactions(Wallet wallet, WalletTransactionType type);


}

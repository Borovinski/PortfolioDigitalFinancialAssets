package com.borovinski.portfoliodigitalfinancialassets.service;


import com.borovinski.portfoliodigitalfinancialassets.model.Order;
import com.borovinski.portfoliodigitalfinancialassets.model.User;
import com.borovinski.portfoliodigitalfinancialassets.model.Wallet;


public interface WalletService {
    Wallet getUserWallet (User user);
    Wallet addBalance(Wallet wallet, Long money);
    Wallet findWalletById(Long id) throws Exception;
    Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception;
    Wallet payOrderPayment(Order order, User user) throws Exception;
}

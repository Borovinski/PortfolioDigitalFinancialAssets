package com.borovinski.service.WalletUserAndWalletTransactions;


import com.borovinski.exception.WalletException;
import com.borovinski.model.Order;
import com.borovinski.model.User;
import com.borovinski.model.Wallet;

public interface WalletService {


    Wallet getUserWallet(User user) throws WalletException;

    public Wallet addBalanceToWallet(Wallet wallet, Long money) throws WalletException;

    public Wallet findWalletById(Long id) throws WalletException;

    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws WalletException;

    public Wallet payOrderPayment(Order order, User user) throws WalletException;


}

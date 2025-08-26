package com.borovinski.service.WalletUserAndWalletTransactions;


import com.borovinski.domain.OrderType;
import com.borovinski.domain.WalletTransactionType;
import com.borovinski.exception.WalletException;
import com.borovinski.model.*;

import com.borovinski.repository.WalletRepository;
import com.borovinski.repository.WalletTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service

public class WalletServiceImplementation implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;


    public Wallet generateWallet(User user) {
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        return walletRepository.save(wallet);
    }

    @Override
    public Wallet getUserWallet(User user) throws WalletException {

        Wallet wallet = walletRepository.findByUserId(user.getId());
        if (wallet != null) {
            return wallet;
        }

        wallet = generateWallet(user);
        return wallet;
    }


    @Override
    public Wallet findWalletById(Long id) throws WalletException {
        Optional<Wallet> wallet = walletRepository.findById(id);
        if (wallet.isPresent()) {
            return wallet.get();
        }
        throw new WalletException("Wallet not found with id " + id);
    }

    @Override
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws WalletException {
        Wallet senderWallet = getUserWallet(sender);

        if (senderWallet.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new WalletException("Insufficient balance...");
        }

        //Списание у отправителя
        BigDecimal senderBalance = senderWallet.getBalance().subtract(BigDecimal.valueOf(amount));
        senderWallet.setBalance(senderBalance);
        walletRepository.save(senderWallet);

        WalletTransaction senderTx = new WalletTransaction();
        senderTx.setWallet(senderWallet);
        senderTx.setDate(LocalDate.now());
        senderTx.setType(WalletTransactionType.WALLET_TRANSFER);
        senderTx.setTransferId(receiverWallet.getId().toString());
        senderTx.setPurpose("Перевод средств");
        senderTx.setAmount(-amount); // минус
        walletTransactionRepository.save(senderTx);

        BigDecimal receiverBalance = receiverWallet.getBalance().add(BigDecimal.valueOf(amount));
        receiverWallet.setBalance(receiverBalance);
        walletRepository.save(receiverWallet);

        WalletTransaction receiverTx = new WalletTransaction();
        receiverTx.setWallet(receiverWallet);
        receiverTx.setDate(LocalDate.now());
        receiverTx.setType(WalletTransactionType.ADD_MONEY);
        receiverTx.setTransferId(senderWallet.getId().toString());
        receiverTx.setPurpose("Получено от другого пользователя");
        receiverTx.setAmount(amount); // плюс
        walletTransactionRepository.save(receiverTx);

        return senderWallet;
    }

    @Override
    public Wallet payOrderPayment(Order order, User user) throws WalletException {
        Wallet wallet = getUserWallet(user);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setDate(LocalDate.now());
        transaction.setTransferId(order.getOrderItem().getCoin().getSymbol());

        if (order.getOrderType().equals(OrderType.BUY)) {
            transaction.setType(WalletTransactionType.BUY_ASSET);
            transaction.setAmount(-order.getPrice().longValue()); // списание
            transaction.setPurpose("Покупка: " + order.getOrderItem().getCoin().getSymbol());

            BigDecimal newBalance = wallet.getBalance().subtract(order.getPrice());
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new WalletException("Insufficient funds for this transaction.");
            }
            wallet.setBalance(newBalance);

        } else if (order.getOrderType().equals(OrderType.SELL)) {
            transaction.setType(WalletTransactionType.SELL_ASSET);
            transaction.setAmount(order.getPrice().longValue()); // зачисление
            transaction.setPurpose("Продажа: " + order.getOrderItem().getCoin().getSymbol());

            BigDecimal newBalance = wallet.getBalance().add(order.getPrice());
            wallet.setBalance(newBalance);
        }

        walletTransactionRepository.save(transaction);
        walletRepository.save(wallet);

        return wallet;
    }

    public Wallet addBalanceToWallet(Wallet wallet, Long money) throws WalletException {
        // Проверка: была ли уже сегодня такая же операция с этой суммой?
        boolean alreadyExists = walletTransactionRepository.existsByWalletAndDateAndTypeAndAmount(
                wallet, LocalDate.now(), WalletTransactionType.ADD_MONEY, money
        );
        if (alreadyExists) {
            throw new WalletException("Пополнение на эту сумму уже было выполнено сегодня. Повторное пополнение запрещено для защиты от случайных дублей.");
        }


        BigDecimal newBalance = wallet.getBalance().add(BigDecimal.valueOf(money));
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        // 2. Создание записи транзакции
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setDate(LocalDate.now());
        transaction.setType(WalletTransactionType.ADD_MONEY);
        transaction.setTransferId("SYSTEM");
        transaction.setPurpose("Пополнение кошелька");
        transaction.setAmount(money); // положительное число

        walletTransactionRepository.save(transaction);

        System.out.println("Пополнение: +" + money + " | Транзакция сохранена");
        return wallet;
    }
}

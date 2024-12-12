package com.borovinski.portfoliodigitalfinancialassets.service;

import com.borovinski.portfoliodigitalfinancialassets.model.User;
import com.borovinski.portfoliodigitalfinancialassets.model.Withdrawal;

import java.util.List;

public interface WithdrawalService {

    Withdrawal requestyWithdrawal(Long amount, User user);

    Withdrawal procedWithwithdrawal(Long withdrawalId, boolean accept) throws Exception;

    List<Withdrawal> getUsersWithdrawalHistory(User user);

    List<Withdrawal> getAllWithdrawalRequest();
}

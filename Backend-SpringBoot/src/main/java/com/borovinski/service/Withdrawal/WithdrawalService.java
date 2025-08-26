package com.borovinski.service.Withdrawal;

import com.borovinski.domain.WithdrawalStatus;
import com.borovinski.model.User;
import com.borovinski.model.Withdrawal;

import java.util.List;

public interface WithdrawalService {

    Withdrawal requestWithdrawal(Long amount, User user);

    Withdrawal procedWithdrawal(Long withdrawalId, boolean accept) throws Exception;

    List<Withdrawal> getUsersWithdrawalHistory(User user);

    List<Withdrawal> getAllWithdrawalRequest();

    long countByStatus(WithdrawalStatus status);
}

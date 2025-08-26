package com.borovinski.repository;

import com.borovinski.domain.WithdrawalStatus;
import com.borovinski.model.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {

    List<Withdrawal> findByUserId(Long userId);

    long countByStatus(WithdrawalStatus status); // ✅ enum

}

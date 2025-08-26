package com.borovinski.controller.Admin;

import com.borovinski.domain.WithdrawalStatus;
import com.borovinski.service.User.UserService;
import com.borovinski.service.Withdrawal.WithdrawalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatsController {

    private final UserService userService;
    private final WithdrawalService withdrawalService;

    public AdminStatsController(UserService userService, WithdrawalService withdrawalService) {
        this.userService = userService;
        this.withdrawalService = withdrawalService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers = userService.countAllUsers();
        long verifiedUsers = userService.countByVerification(true);
        long unverifiedUsers = userService.countByVerification(false);
        long pendingWithdrawals = withdrawalService.countByStatus(WithdrawalStatus.PENDING); // ✅


        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("verifiedUsers", verifiedUsers);
        stats.put("unverifiedUsers", unverifiedUsers);
        stats.put("pendingWithdrawals", pendingWithdrawals);

        return ResponseEntity.ok(stats);
    }
}


package com.borovinski.portfoliodigitalfinancialassets.controller;

import com.borovinski.portfoliodigitalfinancialassets.model.User;
import com.borovinski.portfoliodigitalfinancialassets.model.Wallet;
import com.borovinski.portfoliodigitalfinancialassets.model.WalletTransaction;
import com.borovinski.portfoliodigitalfinancialassets.model.Withdrawal;
import com.borovinski.portfoliodigitalfinancialassets.service.UserService;
import com.borovinski.portfoliodigitalfinancialassets.service.WalletService;
import com.borovinski.portfoliodigitalfinancialassets.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @PostMapping("/api/withdrawal/{amount}")
    public ResponseEntity<?> withdrawalRequest(
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJWT(jwt);
        Wallet userWallet = walletService.getUserWallet(user);

        Withdrawal withdrawal = withdrawalService.requestyWithdrawal(amount, user);
        walletService.addBalance(userWallet, -withdrawal.getAmount());


        return new ResponseEntity<>(withdrawal, HttpStatus.OK);

    }

    @PatchMapping("/api/admin/withdrawal/{id}/proceed/{accept}")
    public ResponseEntity<?> proceedWithdrawal(
            @PathVariable Long id,
            @PathVariable boolean accept,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJWT(jwt);

        Withdrawal withdrawal = withdrawalService.procedWithwithdrawal(id, accept);

        Wallet userWallet = walletService.getUserWallet(user);

        if (!accept) {
            walletService.addBalance(userWallet, withdrawal.getAmount());
        }

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);

    }

    @GetMapping("/api/withdrawal")
    public ResponseEntity<List<Withdrawal>> getWithdrawalHistory(

            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJWT(jwt);

        List<Withdrawal> withdrawal = withdrawalService.getUsersWithdrawalHistory(user);

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }

    @GetMapping("/api/admin/withdrawal")
    public ResponseEntity<List<Withdrawal>> getAllWithdrawalRequest(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJWT(jwt);

        List<Withdrawal> withdrawal = withdrawalService.getAllWithdrawalRequest();

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);

    }



}

package com.borovinski.portfoliodigitalfinancialassets.service;

import com.borovinski.portfoliodigitalfinancialassets.domain.VerificationType;
import com.borovinski.portfoliodigitalfinancialassets.model.ForgotPasswordToken;
import com.borovinski.portfoliodigitalfinancialassets.model.User;

public interface ForgotPasswordService {

    ForgotPasswordToken createToken(User user,
                                    String id, String otp,
                                    VerificationType verificationType,
                                    String sendTo);

    ForgotPasswordToken findById(String id);

    ForgotPasswordToken findByUser(Long UserId);

    void deleteToken(ForgotPasswordToken token);

}

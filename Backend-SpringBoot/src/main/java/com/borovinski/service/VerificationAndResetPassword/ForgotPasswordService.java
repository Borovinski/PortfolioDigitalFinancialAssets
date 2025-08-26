package com.borovinski.service.VerificationAndResetPassword;

import com.borovinski.domain.VerificationType;
import com.borovinski.model.ForgotPasswordToken;
import com.borovinski.model.User;

public interface ForgotPasswordService {

    ForgotPasswordToken createToken(User user, String id, String otp,
                                    VerificationType verificationType, String sendTo);

    ForgotPasswordToken findById(String id);

    ForgotPasswordToken findByUser(Long userId);

    void deleteToken(ForgotPasswordToken token);

    boolean verifyToken(ForgotPasswordToken token, String otp);
}

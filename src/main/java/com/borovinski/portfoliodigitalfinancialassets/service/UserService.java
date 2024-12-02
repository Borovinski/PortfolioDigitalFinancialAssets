package com.borovinski.portfoliodigitalfinancialassets.service;

import com.borovinski.portfoliodigitalfinancialassets.domain.VerificationType;
import com.borovinski.portfoliodigitalfinancialassets.model.User;

public interface UserService {

    public User findUserProfileByJWT(String jwt) throws Exception;
    public User findUserByEmail(String email) throws Exception;
    public User findUserById(Long userId) throws Exception;
    public User enableTwoFactorAuthentication(
            VerificationType verificationType,
            String sendTo,
            User user);
    User updatePassword(User user, String newPassword);
}

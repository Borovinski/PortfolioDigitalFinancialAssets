package com.borovinski.portfoliodigitalfinancialassets.controller;

import com.borovinski.portfoliodigitalfinancialassets.request.ForgotPasswordTokenRequest;
import com.borovinski.portfoliodigitalfinancialassets.domain.VerificationType;
import com.borovinski.portfoliodigitalfinancialassets.model.ForgotPasswordToken;
import com.borovinski.portfoliodigitalfinancialassets.model.User;
import com.borovinski.portfoliodigitalfinancialassets.model.VerificationCode;
import com.borovinski.portfoliodigitalfinancialassets.request.ResetPasswordRequest;
import com.borovinski.portfoliodigitalfinancialassets.response.ApiResponse;
import com.borovinski.portfoliodigitalfinancialassets.response.AuthResponse;
import com.borovinski.portfoliodigitalfinancialassets.service.EmailService;
import com.borovinski.portfoliodigitalfinancialassets.service.ForgotPasswordService;
import com.borovinski.portfoliodigitalfinancialassets.service.UserService;
import com.borovinski.portfoliodigitalfinancialassets.service.VerificationCodeService;
import com.borovinski.portfoliodigitalfinancialassets.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private VerificationCodeService verificationCodeService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ForgotPasswordService forgotPasswordService;
    private String jwt;

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJWT(jwt);
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @PostMapping("api/users/verification/{verificationType}/send-otp")
    public ResponseEntity<String> sendVerificationOtp(
            @RequestHeader("Authorization") String jwt,
            @PathVariable VerificationType verificationType) throws Exception {
//        this.jwt = jwt;
        User user = userService.findUserProfileByJWT(jwt);

        VerificationCode verificationCode = verificationCodeService.
                getVerificationCodeByUser(user.getId());

        if (verificationCode == null) {
            verificationCode = verificationCodeService.
                    sendVerificationCode(user, verificationType);
        }

        if (verificationType.equals(VerificationType.EMAIL)) {
            emailService.sendVerificationOtpEmail(user.getEmail(), verificationCode.getOtp());
        }

        return new ResponseEntity<>("verification otp sent successful!", HttpStatus.OK);
    }

    @PatchMapping("api/users/enable-two-factor/verify-otp/{otp}")
    public ResponseEntity<User> enableTwoFactorAuthentication(
            @PathVariable String otp,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJWT(jwt);

        VerificationCode verificationCode = verificationCodeService.getVerificationCodeByUser(user.getId());

        String sendTo = verificationCode.getVerificationType().equals(VerificationType.EMAIL) ?
                verificationCode.getEmail() : verificationCode.getMobile();
        boolean isVerified = verificationCode.getOtp().equals(otp);

        if (isVerified) {
            User updateUser = userService.enableTwoFactorAuthentication(
                    verificationCode.getVerificationType(), sendTo, user);
            verificationCodeService.deleteVerificationCodeById(verificationCode);
            return new ResponseEntity<>(updateUser, HttpStatus.OK);
        }

        throw new Exception("wrong otp!");
    }

    @PostMapping("/auth/users/reset-password/send-otp")
    public ResponseEntity<AuthResponse> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordTokenRequest request) throws Exception {

        User user = userService.findUserByEmail(request.getSendTo());
        String otp = OtpUtils.generateOtp();
        UUID uuid = UUID.randomUUID();
        String id = uuid.toString();

        ForgotPasswordToken token = forgotPasswordService.findByUser(user.getId());

        if (token == null) {
            token = forgotPasswordService.createToken(
                    user,
                    id,
                    otp,
                    request.getVerificationType(), request.getSendTo());
        }
        if (request.getVerificationType().equals(VerificationType.EMAIL)) {
            emailService.sendVerificationOtpEmail(
                    user.getEmail(),
                    token.getOtp());
        }
        AuthResponse response = new AuthResponse();
        response.setSession(token.getId());
        response.setMessage("Password reset otp sent successfully!");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("auth/users/reset-password/verify-otp")
    public ResponseEntity<ApiResponse> resetPasswordOtp(
            @RequestParam String id,
            @RequestBody ResetPasswordRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {


        ForgotPasswordToken forgotPasswordToken = forgotPasswordService.findById(id);

        boolean isVerified = forgotPasswordToken.getOtp().equals(request.getOtp());

        if (isVerified) {
            userService.updatePassword(forgotPasswordToken.getUser(), request.getPassword());
            ApiResponse res = new ApiResponse();
            res.setMessage("password update successful!");
            return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
        }
        throw new Exception("wrong otp!");
    }


}

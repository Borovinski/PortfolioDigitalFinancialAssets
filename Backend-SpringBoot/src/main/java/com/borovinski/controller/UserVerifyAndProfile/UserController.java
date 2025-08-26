package com.borovinski.controller.UserVerifyAndProfile;

import com.borovinski.config.JWT.JwtProvider;
import com.borovinski.domain.VerificationType;
import com.borovinski.exception.UserException;
import com.borovinski.model.ForgotPasswordToken;
import com.borovinski.model.User;
import com.borovinski.model.VerificationCode;
import com.borovinski.request.ResetPasswordRequest;
import com.borovinski.request.UpdatePasswordRequest;
import com.borovinski.request.UserProfileDto;
import com.borovinski.response.ApiResponse;
import com.borovinski.response.AuthResponse;
import com.borovinski.service.VerificationAndResetPassword.EmailService;
import com.borovinski.service.VerificationAndResetPassword.ForgotPasswordService;
import com.borovinski.service.User.UserService;
import com.borovinski.service.OTP.VerificationService;
import com.borovinski.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.borovinski.request.ChangePasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;


@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserProfileHandler(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        user.setPassword(null);

        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<User> findUserById(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserById(userId);
        user.setPassword(null);

        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @GetMapping("/api/users/email/{email}")
    public ResponseEntity<User> findUserByEmail(
            @PathVariable String email,
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserByEmail(email);

        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @PatchMapping("/api/users/enable-two-factor/verify-otp/{otp}")
    public ResponseEntity<User> enabledTwoFactorAuthentication(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String otp
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        VerificationCode verificationCode = verificationService.findUsersVerification(user);

        String sendTo = verificationCode.getVerificationType().equals(VerificationType.EMAIL)
                ? verificationCode.getEmail()
                : verificationCode.getMobile();

        boolean isVerified = verificationService.VerifyOtp(otp, verificationCode);

        if (isVerified) {
            User updatedUser = userService.enabledTwoFactorAuthentication(
                    verificationCode.getVerificationType(), sendTo, user
            );
            verificationService.deleteVerification(verificationCode);
            return ResponseEntity.ok(updatedUser);
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
    }

    @PatchMapping("/auth/users/reset-password/verify-otp")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestParam String id,
            @RequestBody ResetPasswordRequest req
    ) throws Exception {
        ForgotPasswordToken forgotPasswordToken = forgotPasswordService.findById(id);

        boolean isVerified = forgotPasswordService.verifyToken(forgotPasswordToken, req.getOtp());

        if (isVerified) {

            userService.updatePassword(forgotPasswordToken.getUser(), req.getPassword());
            ApiResponse apiResponse = new ApiResponse();
            apiResponse.setMessage("password updated successfully");
            return ResponseEntity.ok(apiResponse);
        }
        throw new Exception("wrong otp");

    }

    @PostMapping("/auth/users/reset-password/send-otp")
    public ResponseEntity<AuthResponse> sendUpdatePasswordOTP(
            @RequestBody UpdatePasswordRequest req)
            throws Exception {

        User user = userService.findUserByEmail(req.getSendTo());
        String otp = OtpUtils.generateOTP();
        UUID uuid = UUID.randomUUID();
        String id = uuid.toString();

        ForgotPasswordToken token = forgotPasswordService.findByUser(user.getId());

        if (token == null) {
            token = forgotPasswordService.createToken(
                    user, id, otp, req.getVerificationType(), req.getSendTo()
            );
        }

        if (req.getVerificationType().equals(VerificationType.EMAIL)) {
            emailService.sendVerificationOtpEmail(
                    user.getEmail(),
                    token.getOtp()
            );
        }

        AuthResponse res = new AuthResponse();
        res.setSession(token.getId());
        res.setMessage("Password Reset OTP sent successfully.");

        return ResponseEntity.ok(res);

    }

    //Убрал
//    @PatchMapping("/api/users/verification/verify-otp/{otp}")
//    public ResponseEntity<User> verifyOTP(
//            @RequestHeader("Authorization") String jwt,
//            @PathVariable String otp
//    ) throws Exception {
//        User user = userService.findUserProfileByJwt(jwt);
//        VerificationCode verificationCode = verificationService.findUsersVerification(user);
//
//        boolean isVerified = verificationService.VerifyOtp(otp, verificationCode);
//
//        if (isVerified) {
//            verificationService.deleteVerification(verificationCode);
//            User verifiedUser = userService.verifyUser(user);
//            return ResponseEntity.ok(verifiedUser);
//        }
//
//        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
//    }

    @PostMapping("/api/users/verification/{verificationType}/send-otp")
    public ResponseEntity<String> sendVerificationOTP(
            @PathVariable VerificationType verificationType,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserProfileByJwt(jwt);

        VerificationCode verificationCode = verificationService.findUsersVerification(user);

        if (verificationCode == null) {
            verificationCode = verificationService.sendVerificationOTP(user, verificationType);
        }


        if (verificationType.equals(VerificationType.EMAIL)) {
            emailService.sendVerificationOtpEmail(user.getEmail(), verificationCode.getOtp());
        }


        return ResponseEntity.ok("Verification OTP sent successfully.");

    }

    //Редактирование профиля
    @PutMapping("/api/users/profile")
    public ResponseEntity<User> updateUserProfileHandler(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UserProfileDto dto
    ) throws UserException {

        String email = JwtProvider.getEmailFromJwtToken(jwt);
        User updatedUser = userService.updateUserProfile(dto, email);
        updatedUser.setPassword(null);

        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    //Метод для изменения пароля на странице профиля пользователя
    @PutMapping("/api/users/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            @RequestHeader("Authorization") String jwt,
            @RequestBody ChangePasswordRequest request
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Неверный текущий пароль"));
        }

        userService.updatePassword(user, request.getNewPassword());

        return ResponseEntity.ok(new ApiResponse("Пароль успешно изменён"));
    }

}

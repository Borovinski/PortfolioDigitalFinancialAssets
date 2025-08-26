package com.borovinski.controller.UserVerifyAndProfile;

import com.borovinski.service.VerificationAndResetPassword.EmailService;
import com.borovinski.service.User.UserService;
import com.borovinski.service.OTP.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VerificationController {
    private final VerificationService verificationService;
    private final UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    public VerificationController(VerificationService verificationService, UserService userService) {
        this.verificationService = verificationService;
        this.userService = userService;
    }
}

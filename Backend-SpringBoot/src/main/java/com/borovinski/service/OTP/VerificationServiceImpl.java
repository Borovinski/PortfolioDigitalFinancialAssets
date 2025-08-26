package com.borovinski.service.OTP;

import com.borovinski.domain.VerificationType;
import com.borovinski.model.User;
import com.borovinski.model.VerificationCode;
import com.borovinski.repository.VerificationRepository;
import com.borovinski.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VerificationServiceImpl implements VerificationService {

    @Autowired
    private VerificationRepository verificationRepository;

    @Override
    public VerificationCode sendVerificationOTP(User user, VerificationType verificationType) {

        VerificationCode verificationCode = new VerificationCode();

        verificationCode.setOtp(OtpUtils.generateOTP());
        verificationCode.setUser(user);
        verificationCode.setVerificationType(verificationType);

        return verificationRepository.save(verificationCode);
    }

    @Override
    public VerificationCode findVerificationById(Long id) throws Exception {
        Optional<VerificationCode> verificationCodeOption = verificationRepository.findById(id);
        if (verificationCodeOption.isEmpty()) {
            throw new Exception("verification not found");
        }
        return verificationCodeOption.get();
    }

    @Override
    public VerificationCode findUsersVerification(User user) throws Exception {
        return verificationRepository.findByUserId(user.getId());
    }

    @Override
    public Boolean VerifyOtp(String inputOtp, VerificationCode verificationCode) {
        if (verificationCode == null) {
            throw new IllegalArgumentException("Verification code not found");
        }
        if (verificationCode.getOtp() == null) {
            throw new IllegalArgumentException("Stored OTP is null");
        }

        return inputOtp.trim().equals(verificationCode.getOtp().trim());
    }

    @Override
    public void deleteVerification(VerificationCode verificationCode) {
        verificationRepository.delete(verificationCode);
    }


}

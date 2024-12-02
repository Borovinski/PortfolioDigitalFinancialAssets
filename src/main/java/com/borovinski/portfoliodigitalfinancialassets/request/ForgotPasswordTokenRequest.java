package com.borovinski.portfoliodigitalfinancialassets.request;

import com.borovinski.portfoliodigitalfinancialassets.domain.VerificationType;
import lombok.Data;

@Data
public class ForgotPasswordTokenRequest {

    private String sendTo;
    private VerificationType verificationType;
}

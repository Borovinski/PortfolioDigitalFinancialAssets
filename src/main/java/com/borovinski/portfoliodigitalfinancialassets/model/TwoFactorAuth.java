package com.borovinski.portfoliodigitalfinancialassets.model;


import com.borovinski.portfoliodigitalfinancialassets.domain.VerificationType;
import lombok.Data;

@Data
public class TwoFactorAuth {
    private boolean isEnabled = false;
    private VerificationType sendTo;

}

package com.borovinski.portfoliodigitalfinancialassets.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String otp;
    private String password;
}

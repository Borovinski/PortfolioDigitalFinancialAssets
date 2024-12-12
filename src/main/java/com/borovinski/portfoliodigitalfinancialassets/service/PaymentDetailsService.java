package com.borovinski.portfoliodigitalfinancialassets.service;

import com.borovinski.portfoliodigitalfinancialassets.model.PaymentDetails;
import com.borovinski.portfoliodigitalfinancialassets.model.User;

public interface PaymentDetailsService {
    public PaymentDetails addPaymentDetails(String accountNumber,
                                            String accountHolderName,
                                            String ifsc,
                                            String bankName,
                                            User user);
    public PaymentDetails getUsersPaymentDetails(User user);
}

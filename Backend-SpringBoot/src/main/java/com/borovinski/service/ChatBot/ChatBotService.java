package com.borovinski.service.ChatBot;

import com.borovinski.model.CoinDTO;
import com.borovinski.response.ApiResponse;
import com.borovinski.response.FunctionResponse;

public interface ChatBotService {
    ApiResponse getCoinDetails(String coinName);

    FunctionResponse getFunctionResponse(String prompt);

    CoinDTO getCoinByName(String coinName);

    String simpleChat(String prompt);
}

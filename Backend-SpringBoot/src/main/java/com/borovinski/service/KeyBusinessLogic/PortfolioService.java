package com.borovinski.service.KeyBusinessLogic;

import com.borovinski.model.User;
import com.borovinski.response.PortfolioBusinessLogic.AssetRecommendationDTO;
import com.borovinski.response.PortfolioBusinessLogic.CoinProfitabilityDTO;
import com.borovinski.response.PortfolioBusinessLogic.DiversificationDTO;

import java.util.List;

public interface PortfolioService {

    List<CoinProfitabilityDTO> calculateProfitabilityPerCoin(User user);

    List<DiversificationDTO> calculateDiversification(User user);

    List<AssetRecommendationDTO> optimizePortfolio(User user);

    void rebalancePortfolio(User user);
}

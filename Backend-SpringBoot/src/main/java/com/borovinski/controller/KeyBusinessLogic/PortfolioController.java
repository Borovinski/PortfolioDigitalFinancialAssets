package com.borovinski.controller.KeyBusinessLogic;

import com.borovinski.exception.UserException;
import com.borovinski.model.User;
import com.borovinski.response.PortfolioBusinessLogic.AssetRecommendationDTO;
import com.borovinski.response.PortfolioBusinessLogic.CoinProfitabilityDTO;
import com.borovinski.response.PortfolioBusinessLogic.DiversificationDTO;
import com.borovinski.service.KeyBusinessLogic.PortfolioService;
import com.borovinski.service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final UserService userService;

    @GetMapping("/profitability/per-coin")
    public ResponseEntity<List<CoinProfitabilityDTO>> getProfitabilityPerCoin(
            @RequestHeader("Authorization") String jwt
    ) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        List<CoinProfitabilityDTO> response = portfolioService.calculateProfitabilityPerCoin(user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/diversification")
    public ResponseEntity<List<DiversificationDTO>> getDiversification(
            @RequestHeader("Authorization") String jwt
    ) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        List<DiversificationDTO> response = portfolioService.calculateDiversification(user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/optimize")
    public ResponseEntity<List<AssetRecommendationDTO>> optimizePortfolio(
            @RequestHeader("Authorization") String jwt
    ) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        List<AssetRecommendationDTO> response = portfolioService.optimizePortfolio(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/rebalance")
    public ResponseEntity<String> rebalancePortfolio(
            @RequestHeader("Authorization") String jwt
    ) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        portfolioService.rebalancePortfolio(user);
        return ResponseEntity.ok("Портфель успешно оптимизирован");
    }
}

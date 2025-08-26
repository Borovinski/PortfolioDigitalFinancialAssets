package com.borovinski.service.KeyBusinessLogic;

import com.borovinski.model.Asset;
import com.borovinski.model.Coin;
import com.borovinski.model.User;
import com.borovinski.repository.AssetsRepository;
import com.borovinski.response.PortfolioBusinessLogic.AssetRecommendationDTO;
import com.borovinski.response.PortfolioBusinessLogic.CoinProfitabilityDTO;
import com.borovinski.response.PortfolioBusinessLogic.DiversificationDTO;
import com.borovinski.service.BuyCoin.OrderService;
import com.borovinski.service.CoinApi.CoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final AssetsRepository assetsRepository;
    private final PriceService priceService;
    private final OrderService orderService;
    private final CoinService coinService;

    @Override
    public List<CoinProfitabilityDTO> calculateProfitabilityPerCoin(User user) {
        List<Asset> assets = assetsRepository.findByUserId(user.getId());

        List<CoinProfitabilityDTO> results = new ArrayList<>();

        for (Asset asset : assets) {
            BigDecimal quantity = BigDecimal.valueOf(asset.getQuantity());
            BigDecimal buyPrice = BigDecimal.valueOf(asset.getBuyPrice());
            Coin coin = asset.getCoin();
            BigDecimal currentPrice = priceService.getCurrentPrice(coin.getSymbol());

            BigDecimal invested = buyPrice.multiply(quantity);
            BigDecimal currentValue = currentPrice.multiply(quantity);
            BigDecimal profit = currentValue.subtract(invested);
            BigDecimal profitPercent = invested.compareTo(BigDecimal.ZERO) == 0
                    ? BigDecimal.ZERO
                    : profit.divide(invested, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));

            results.add(new CoinProfitabilityDTO(
                    coin.getSymbol().toUpperCase(),
                    quantity.setScale(4, RoundingMode.HALF_UP),
                    buyPrice.setScale(2, RoundingMode.HALF_UP),
                    currentPrice.setScale(2, RoundingMode.HALF_UP),
                    invested.setScale(2, RoundingMode.HALF_UP),
                    currentValue.setScale(2, RoundingMode.HALF_UP),
                    profit.setScale(2, RoundingMode.HALF_UP),
                    profitPercent.setScale(2, RoundingMode.HALF_UP)
            ));
        }
        return results;
    }

    @Override
    public List<DiversificationDTO> calculateDiversification(User user) {
        List<Asset> assets = assetsRepository.findByUserId(user.getId());

        BigDecimal totalCurrentValue = BigDecimal.ZERO;
        List<DiversificationDTO> result = new ArrayList<>();

        // Сначала посчитаем полную текущую стоимость портфеля
        List<BigDecimal> currentValues = new ArrayList<>();

        for (Asset asset : assets) {
            BigDecimal quantity = BigDecimal.valueOf(asset.getQuantity());
            BigDecimal currentPrice = priceService.getCurrentPrice(asset.getCoin().getSymbol());
            BigDecimal currentValue = currentPrice.multiply(quantity);
            currentValues.add(currentValue);
            totalCurrentValue = totalCurrentValue.add(currentValue);
        }

        // Теперь создаём DTO по каждой монете
        for (int i = 0; i < assets.size(); i++) {
            Asset asset = assets.get(i);
            BigDecimal currentValue = currentValues.get(i);
            BigDecimal percent = totalCurrentValue.compareTo(BigDecimal.ZERO) == 0
                    ? BigDecimal.ZERO
                    : currentValue.divide(totalCurrentValue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));

            result.add(new DiversificationDTO(
                    asset.getCoin().getSymbol().toUpperCase(),
                    currentValue.setScale(2, RoundingMode.HALF_UP),
                    percent.setScale(2, RoundingMode.HALF_UP)
            ));
        }

        return result;
    }

    @Override
    public List<AssetRecommendationDTO> optimizePortfolio(User user) {
        List<Asset> assets = assetsRepository.findByUserId(user.getId());

        BigDecimal totalValue = BigDecimal.ZERO;
        List<BigDecimal> currentValues = new ArrayList<>();

        for (Asset asset : assets) {
            BigDecimal quantity = BigDecimal.valueOf(asset.getQuantity());
            BigDecimal currentPrice = priceService.getCurrentPrice(asset.getCoin().getSymbol());
            BigDecimal currentValue = currentPrice.multiply(quantity);

            currentValues.add(currentValue);
            totalValue = totalValue.add(currentValue);
        }

        int assetCount = assets.size();
        BigDecimal targetPercent = assetCount == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(100).divide(BigDecimal.valueOf(assetCount), 2, RoundingMode.HALF_UP);

        List<AssetRecommendationDTO> recommendations = new ArrayList<>();

        for (int i = 0; i < assets.size(); i++) {
            Asset asset = assets.get(i);
            BigDecimal currentValue = currentValues.get(i);
            BigDecimal currentPercent = totalValue.compareTo(BigDecimal.ZERO) == 0
                    ? BigDecimal.ZERO
                    : currentValue.divide(totalValue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));

            BigDecimal difference = targetPercent.subtract(currentPercent);

            recommendations.add(new AssetRecommendationDTO(
                    asset.getCoin().getSymbol(),
                    currentPercent.setScale(2, RoundingMode.HALF_UP),
                    targetPercent.setScale(2, RoundingMode.HALF_UP),
                    difference.setScale(2, RoundingMode.HALF_UP)
            ));
        }

        return recommendations;
    }

    @Override
    public void rebalancePortfolio(User user) {
        List<AssetRecommendationDTO> recommendations = this.optimizePortfolio(user);
        List<Asset> assets = assetsRepository.findByUserId(user.getId());

        BigDecimal totalSoldUSD = BigDecimal.ZERO;

        // === 1. ПРОДАЖА активов с избытком
        for (AssetRecommendationDTO rec : recommendations) {
            if (rec.difference().compareTo(BigDecimal.ONE.negate()) < 0) {
                Asset asset = findAssetBySymbol(assets, rec.symbol());
                if (asset == null) continue;

                Coin coin = asset.getCoin();
                BigDecimal currentPrice = priceService.getCurrentPrice(coin.getSymbol());
                BigDecimal quantity = BigDecimal.valueOf(asset.getQuantity());
                BigDecimal totalValue = currentPrice.multiply(quantity);

                BigDecimal percentToSell = rec.difference().abs();
                BigDecimal usdToSell = totalValue.multiply(percentToSell)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                BigDecimal qtyToSell = usdToSell.divide(currentPrice, 8, RoundingMode.HALF_UP);

                try {
                    orderService.sellAsset(coin, qtyToSell.doubleValue(), user);
                    totalSoldUSD = totalSoldUSD.add(usdToSell);
                } catch (Exception e) {
                    System.out.println("Ошибка при продаже " + rec.symbol() + ": " + e.getMessage());
                }
            }
        }

        // === 2. ПОКУПКА недостающих активов
        List<AssetRecommendationDTO> toBuy = recommendations.stream()
                .filter(r -> r.difference().compareTo(BigDecimal.ONE) > 0)
                .collect(Collectors.toList());

        if (totalSoldUSD.compareTo(BigDecimal.ZERO) == 0 || toBuy.isEmpty()) return;

        BigDecimal totalDiffSum = toBuy.stream()
                .map(AssetRecommendationDTO::difference)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        for (AssetRecommendationDTO rec : toBuy) {
            try {
                Coin coin = coinService.findBySymbol(rec.symbol().toLowerCase());
                BigDecimal price = priceService.getCurrentPrice(coin.getSymbol());

                BigDecimal percent = rec.difference().divide(totalDiffSum, 8, RoundingMode.HALF_UP);
                BigDecimal usdToSpend = totalSoldUSD.multiply(percent);
                BigDecimal qtyToBuy = usdToSpend.divide(price, 8, RoundingMode.HALF_UP);

                orderService.buyAsset(coin, qtyToBuy.doubleValue(), user);
            } catch (Exception e) {
                System.out.println("Ошибка при покупке " + rec.symbol() + ": " + e.getMessage());
            }
        }
    }


    private Asset findAssetBySymbol(List<Asset> assets, String symbol) {
        return assets.stream()
                .filter(a -> a.getCoin().getSymbol().equalsIgnoreCase(symbol))
                .findFirst()
                .orElse(null);
    }

}

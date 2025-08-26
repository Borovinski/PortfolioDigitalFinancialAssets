package com.borovinski;

import com.borovinski.model.Asset;
import com.borovinski.model.Coin;
import com.borovinski.model.Order;
import com.borovinski.model.User;
import com.borovinski.repository.AssetsRepository;
import com.borovinski.response.PortfolioBusinessLogic.AssetRecommendationDTO;
import com.borovinski.response.PortfolioBusinessLogic.CoinProfitabilityDTO;
import com.borovinski.response.PortfolioBusinessLogic.DiversificationDTO;
import com.borovinski.service.BuyCoin.OrderService;
import com.borovinski.service.CoinApi.CoinService;
import com.borovinski.service.KeyBusinessLogic.PortfolioServiceImpl;
import com.borovinski.service.KeyBusinessLogic.PriceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceImplTest {

    @Mock
    private AssetsRepository assetsRepository;

    @Mock
    private PriceService priceService;

    @Mock
    private OrderService orderService;

    @Mock
    private CoinService coinService;

    @InjectMocks
    private PortfolioServiceImpl portfolioService;

    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
    }

    @Test
    void testCalculateProfitabilityPerCoin() {
        Coin coin = new Coin();
        coin.setSymbol("btc");

        Asset asset = new Asset();
        asset.setQuantity(2.0);
        asset.setBuyPrice(25000.0);
        asset.setCoin(coin);

        when(assetsRepository.findByUserId(1L)).thenReturn(List.of(asset));
        when(priceService.getCurrentPrice("btc")).thenReturn(BigDecimal.valueOf(30000));

        List<CoinProfitabilityDTO> result = portfolioService.calculateProfitabilityPerCoin(user);

        assertEquals(1, result.size());
        CoinProfitabilityDTO dto = result.get(0);
        assertEquals("BTC", dto.symbol());
        assertEquals(0, dto.profitPercent().compareTo(BigDecimal.valueOf(20.0)));
    }

    @Test
    void testCalculateDiversification() {
        Coin btc = new Coin();
        btc.setSymbol("btc");
        Coin eth = new Coin();
        eth.setSymbol("eth");

        Asset btcAsset = new Asset();
        btcAsset.setQuantity(1.0);
        btcAsset.setCoin(btc);

        Asset ethAsset = new Asset();
        ethAsset.setQuantity(2.0);
        ethAsset.setCoin(eth);

        when(assetsRepository.findByUserId(1L)).thenReturn(List.of(btcAsset, ethAsset));
        when(priceService.getCurrentPrice("btc")).thenReturn(BigDecimal.valueOf(30000));
        when(priceService.getCurrentPrice("eth")).thenReturn(BigDecimal.valueOf(2000));

        List<DiversificationDTO> result = portfolioService.calculateDiversification(user);

        assertEquals(2, result.size());

        DiversificationDTO btcDto = result.stream().filter(d -> d.symbol().equals("BTC")).findFirst().orElseThrow();
        DiversificationDTO ethDto = result.stream().filter(d -> d.symbol().equals("ETH")).findFirst().orElseThrow();

        assertEquals(0, btcDto.currentValue().compareTo(BigDecimal.valueOf(30000.00)));
        assertEquals(0, ethDto.currentValue().compareTo(BigDecimal.valueOf(4000.00)));
        assertEquals(0, btcDto.percentage().compareTo(BigDecimal.valueOf(88.24)));
        assertEquals(0, ethDto.percentage().compareTo(BigDecimal.valueOf(11.76)));
    }

    @Test
    void testOptimizePortfolio() {
        Coin btc = new Coin();
        btc.setSymbol("btc");
        Coin eth = new Coin();
        eth.setSymbol("eth");

        Asset btcAsset = new Asset();
        btcAsset.setQuantity(1.0);
        btcAsset.setCoin(btc);

        Asset ethAsset = new Asset();
        ethAsset.setQuantity(1.0);
        ethAsset.setCoin(eth);

        when(assetsRepository.findByUserId(1L)).thenReturn(List.of(btcAsset, ethAsset));
        when(priceService.getCurrentPrice("btc")).thenReturn(BigDecimal.valueOf(30000));
        when(priceService.getCurrentPrice("eth")).thenReturn(BigDecimal.valueOf(10000));

        List<AssetRecommendationDTO> result = portfolioService.optimizePortfolio(user);

        assertEquals(2, result.size());

        AssetRecommendationDTO btcRec = result.stream().filter(r -> r.symbol().equals("btc")).findFirst().orElseThrow();
        AssetRecommendationDTO ethRec = result.stream().filter(r -> r.symbol().equals("eth")).findFirst().orElseThrow();

        assertEquals(0, btcRec.currentPercent().add(ethRec.currentPercent()).compareTo(BigDecimal.valueOf(100.00)));
        assertEquals(0, btcRec.targetPercent().compareTo(ethRec.targetPercent()));
        assertEquals(0, btcRec.targetPercent().compareTo(BigDecimal.valueOf(50.00)));
    }

    @Test
    void testRebalancePortfolioDoesNotCrash() throws Exception {
        Coin btc = new Coin();
        btc.setSymbol("btc");
        Coin eth = new Coin();
        eth.setSymbol("eth");

        Asset btcAsset = new Asset();
        btcAsset.setQuantity(3.0);
        btcAsset.setCoin(btc);

        Asset ethAsset = new Asset();
        ethAsset.setQuantity(1.0);
        ethAsset.setCoin(eth);

        when(assetsRepository.findByUserId(1L)).thenReturn(List.of(btcAsset, ethAsset));
        when(priceService.getCurrentPrice("btc")).thenReturn(BigDecimal.valueOf(30000));
        when(priceService.getCurrentPrice("eth")).thenReturn(BigDecimal.valueOf(2000));
        when(coinService.findBySymbol("eth")).thenReturn(eth);

        Order fakeOrder = mock(Order.class);
        when(orderService.sellAsset(any(), anyDouble(), any())).thenReturn(fakeOrder);
        when(orderService.buyAsset(any(), anyDouble(), any())).thenReturn(fakeOrder);

        assertDoesNotThrow(() -> portfolioService.rebalancePortfolio(user));

        verify(orderService, atLeastOnce()).sellAsset(any(), anyDouble(), any());
        verify(orderService, atLeastOnce()).buyAsset(any(), anyDouble(), any());
    }
}


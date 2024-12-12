package com.borovinski.portfoliodigitalfinancialassets.controller;


import com.borovinski.portfoliodigitalfinancialassets.model.Coin;
import com.borovinski.portfoliodigitalfinancialassets.model.User;
import com.borovinski.portfoliodigitalfinancialassets.model.Watchlist;
import com.borovinski.portfoliodigitalfinancialassets.service.CoinService;
import com.borovinski.portfoliodigitalfinancialassets.service.UserService;
import com.borovinski.portfoliodigitalfinancialassets.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;

    @GetMapping("/user")
    public ResponseEntity<Watchlist> getUserWatchlist(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJWT(jwt);
        Watchlist watchlist = watchlistService.findUserWatchList(user.getId());
        return ResponseEntity.ok(watchlist);
    }

    @GetMapping("/{watchlistId}")
    public ResponseEntity<Watchlist> getWatchlistById(
            @PathVariable Long watchlistId) throws Exception {

        Watchlist watchlist = watchlistService.findUserWatchList(watchlistId);
        return ResponseEntity.ok(watchlist);
    }

    @PatchMapping("/add/coin/{coinId}")
    public ResponseEntity<Coin> addItemToWatchlist(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String coinId) throws Exception {

        User user = userService.findUserProfileByJWT(jwt);
        Coin coin = coinService.findById(coinId);
        Coin addCoin = watchlistService.addItemToWatchList(coin, user);
        return ResponseEntity.ok(addCoin);

    }


}

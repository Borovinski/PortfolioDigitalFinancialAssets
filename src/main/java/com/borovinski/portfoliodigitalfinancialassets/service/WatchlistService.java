package com.borovinski.portfoliodigitalfinancialassets.service;

import com.borovinski.portfoliodigitalfinancialassets.model.Coin;
import com.borovinski.portfoliodigitalfinancialassets.model.User;
import com.borovinski.portfoliodigitalfinancialassets.model.Watchlist;

public interface WatchlistService {

    Watchlist findUserWatchList(Long userId) throws Exception;
    Watchlist createWatchList(User user);
    Watchlist findById(Long id) throws Exception;
    Coin addItemToWatchList(Coin coin, User user) throws Exception;


}

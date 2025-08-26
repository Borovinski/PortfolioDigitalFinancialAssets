package com.borovinski.service.Watchlist;

import com.borovinski.model.Coin;
import com.borovinski.model.User;
import com.borovinski.model.Watchlist;

public interface WatchlistService {

    Watchlist findUserWatchlist(Long userId) throws Exception;

    Watchlist createWatchList(User user);

    Watchlist findById(Long id) throws Exception;

    Coin addItemToWatchlist(Coin coin, User user) throws Exception;

    public void removeItemFromWatchlist(Coin coin, User user) throws Exception;
}

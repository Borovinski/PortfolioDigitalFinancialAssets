package com.borovinski.repository;

import com.borovinski.model.Coin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoinRepository extends JpaRepository<Coin, String> {

    Optional<Coin> findBySymbol(String symbol);

    Optional<Coin> findBySymbolIgnoreCase(String symbol);
}

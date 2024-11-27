package com.borovinski.portfoliodigitalfinancialassets.controller;



import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public String home() {
        return "Welcome to Borovinski Portfolio Digital Financial Assets";
    }
    @GetMapping("/api")
    public String secure() {
        return "Welcome to Borovinski Portfolio Digital Financial Assets";
    }
}

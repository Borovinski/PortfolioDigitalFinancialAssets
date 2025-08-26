package com.borovinski.domain;
//Подразумевалось использовать несколько платежных шлюзов, но многие API в Беларуси не работают,
// (поэтому Paddle как пример)
public enum PaymentMethod {
    PADDLE,
    STRIPE,
}

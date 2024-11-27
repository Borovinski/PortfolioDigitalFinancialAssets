package com.borovinski.portfoliodigitalfinancialassets.model;

import com.borovinski.portfoliodigitalfinancialassets.domain.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

//сущность для пользователя в базе данных
@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullName;
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) //это поле будет доступно только для записи
    private String password;
    // встроенная сущность, чтобы не создавать еще одну таблицу в базе данных
    @Embedded
    private TwoFactorAuth twoFactorAuth = new TwoFactorAuth();

    private USER_ROLE role = USER_ROLE.ROLE_USER;
}

package com.borovinski.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.borovinski.domain.USER_ROLE;
import com.borovinski.domain.UserStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullName;
    private String email;
    private String mobile;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private UserStatus status = UserStatus.PENDING;

//    тестовое поле с двухфактарной аутентификацией
    private boolean isVerified = false;

    @Embedded
    private TwoFactorAuth twoFactorAuth = new TwoFactorAuth();

    private String picture;

    private USER_ROLE role = USER_ROLE.ROLE_USER;

    // редактируемые поля в профиле пользователя
    private String address;

    private String city;

    private String postcode;

    private String country;

    private String nationality;

    private LocalDate dateOfBirth;

    // Поле для блокировки аккаунта, специально для администратора
    @Setter
    @Getter
    private boolean accountNonLocked = true;

}

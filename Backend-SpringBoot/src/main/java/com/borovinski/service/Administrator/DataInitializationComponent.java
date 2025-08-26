package com.borovinski.service.Administrator;

import com.borovinski.domain.USER_ROLE;


import com.borovinski.domain.VerificationType;
import com.borovinski.model.User;
import com.borovinski.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializationComponent implements CommandLineRunner {

    private final UserRepository userRepository;


    private PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializationComponent(UserRepository userRepository,
                                       PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }

    @Override
    public void run(String... args) {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        String adminUsername = "administrator@gmail.com";

        if (userRepository.findByEmail(adminUsername) == null) {
            User adminUser = new User();

            adminUser.setPassword(passwordEncoder.encode("12345678"));
            adminUser.setFullName("Администратор Администратор");
            adminUser.setEmail(adminUsername);
            adminUser.setRole(USER_ROLE.ROLE_ADMIN);
            //Было принято решение создавать администратора как верифицированного пользователя
//            adminUser.setVerified(true);
            adminUser.getTwoFactorAuth().setEnabled(true);
            adminUser.getTwoFactorAuth().setSendTo(VerificationType.EMAIL);

            User admin = userRepository.save(adminUser);
        }
    }
}

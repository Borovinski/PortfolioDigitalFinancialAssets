package com.borovinski.repository;


import com.borovinski.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {

    public User findByEmail(String email);

    long count();

    long countByTwoFactorAuth_Enabled(boolean enabled);

}

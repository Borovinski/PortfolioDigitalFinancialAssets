package com.borovinski.controller.Admin;

import com.borovinski.model.User;
import com.borovinski.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    // Получить список всех пользователей
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Заблокировать / разблокировать пользователя (через accountNonLocked)
    @PatchMapping("/users/{id}/toggle-lock")
    @Transactional
    public ResponseEntity<String> toggleUserLock(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setAccountNonLocked(!user.isAccountNonLocked());
        return ResponseEntity.ok("Пользователь " + (user.isAccountNonLocked() ? "разблокирован" : "заблокирован"));
    }

    @PatchMapping("/users/{id}/change-role")
    @Transactional
    public ResponseEntity<String> changeUserRole(@PathVariable Long id, @RequestParam("role") int roleOrdinal) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(com.borovinski.domain.USER_ROLE.values()[roleOrdinal]);
        return ResponseEntity.ok("Роль пользователя обновлена");
    }
}
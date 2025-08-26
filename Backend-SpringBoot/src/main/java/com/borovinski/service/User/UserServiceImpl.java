package com.borovinski.service.User;

import com.borovinski.config.JWT.JwtProvider;
import com.borovinski.domain.VerificationType;
import com.borovinski.exception.AccessDeniedException;
import com.borovinski.exception.UserException;
import com.borovinski.model.TwoFactorAuth;
import com.borovinski.model.User;
import com.borovinski.repository.UserRepository;

import com.borovinski.request.UserProfileDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
        String email = JwtProvider.getEmailFromJwtToken(jwt);


        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UserException("user not exist with email " + email);
        }
        return user;
    }

    @Override
    public User findUserByEmail(String username) throws UserException {

        User user = userRepository.findByEmail(username);

        if (user != null) {

            return user;
        }

        throw new UserException("user not exist with username " + username);
    }

    @Override
    public User findUserById(Long userId) throws UserException {
        Optional<User> opt = userRepository.findById(userId);

        if (opt.isEmpty()) {
            throw new UserException("user not found with id " + userId);
        }
        return opt.get();
    }

//    @Override
//    public User verifyUser(User user) throws UserException {
//        user.setVerified(true);
//        return userRepository.save(user);
//    }

    @Override
    public User enabledTwoFactorAuthentication(
            VerificationType verificationType, String sendTo, User user) throws UserException {
        TwoFactorAuth twoFactorAuth = new TwoFactorAuth();
        twoFactorAuth.setEnabled(true);
        twoFactorAuth.setSendTo(verificationType);

        user.setTwoFactorAuth(twoFactorAuth);
        return userRepository.save(user);
    }

    @Override
    public User updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    @Override
    public void sendUpdatePasswordOtp(String email, String otp) {

    }

    // РЕАЛИЗАЦИЯ ОБНОВЛЕНИЯ ПРОФИЛЯ
    @Override
    public User updateUserProfile(UserProfileDto dto, String email) throws UserException {
        User user = userRepository.findByEmail(email);
        if (user == null) throw new UserException("User not found with email: " + email);
        user.setFullName(dto.getFullName());
        user.setAddress(dto.getAddress());
        user.setCity(dto.getCity());
        user.setPostcode(dto.getPostcode());
        user.setCountry(dto.getCountry());
        user.setNationality(dto.getNationality());
        user.setDateOfBirth(dto.getDateOfBirth());

        return userRepository.save(user);
    }

    //метод для верификации пользователя
    @Override
    public void validateUserAccess(User user) {
        if (!user.getTwoFactorAuth().isEnabled()) {
            throw new AccessDeniedException();
        }
    }

    //Метод для администратора
    @Override
    public long count() {
        return userRepository.count();
    }

    //Метод для администратора
    @Override
    public long countByTwoFactorAuthEnabled(boolean enabled) {
        return userRepository.countByTwoFactorAuth_Enabled(enabled);
    }

    @Override
    public long countAllUsers() {
        return userRepository.count();
    }

    @Override
    public long countByVerification(boolean enabled) {
        return userRepository.countByTwoFactorAuth_Enabled(enabled);
    }
}

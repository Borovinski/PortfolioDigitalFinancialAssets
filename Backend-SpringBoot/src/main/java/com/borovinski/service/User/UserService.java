package com.borovinski.service.User;


import com.borovinski.domain.VerificationType;
import com.borovinski.exception.UserException;
import com.borovinski.model.User;
import com.borovinski.request.UserProfileDto;


public interface UserService {

    public User findUserProfileByJwt(String jwt) throws UserException;

    public User findUserByEmail(String email) throws UserException;

    public User findUserById(Long userId) throws UserException;

//    public User verifyUser(User user) throws UserException;

    public User enabledTwoFactorAuthentication(VerificationType verificationType,
                                               String sendTo, User user) throws UserException;

    User updatePassword(User user, String newPassword);

    void sendUpdatePasswordOtp(String email, String otp);

    //новый метод для обновления профиля
    User updateUserProfile(UserProfileDto dto, String email) throws UserException;

    //метод для проверки верификации пользователя
    void validateUserAccess(User user);

    //метод для администратора
    long count(); // уже есть по умолчанию

    //метод для администратора
    long countByTwoFactorAuthEnabled(boolean enabled);

    //метод для администратора
    long countAllUsers();

    //метод для администратора
    long countByVerification(boolean enabled);

}

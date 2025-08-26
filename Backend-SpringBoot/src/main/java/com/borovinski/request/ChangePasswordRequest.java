package com.borovinski.request;

//Мой класс для изменения пароля на странице пользователя
public class ChangePasswordRequest {

    private String currentPassword;
    private String newPassword;

    // Getters и Setters
    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

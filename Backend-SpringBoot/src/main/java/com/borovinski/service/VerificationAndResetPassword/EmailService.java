package com.borovinski.service.VerificationAndResetPassword;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;


    public void sendVerificationOtpEmail(String userEmail, String otp) throws MessagingException, MailSendException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Подтверждение действия в Crypto Portfolio";
        String text = "<div style='font-family:Arial,sans-serif;font-size:16px;color:#333;'>"
                + "<h2 style='color:#00BFFF;'>Crypto Portfolio</h2>"
                + "<p>Вы запросили подтверждение действия в вашем аккаунте.</p>"
                + "<p>Пожалуйста, используйте следующий одноразовый код:</p>"
                + "<p style='font-size:24px;font-weight:bold;color:#2C3E50;margin:20px 0;'>" + otp + "</p>"
                + "<p>Введите этот код в приложении, чтобы завершить верификацию или смену пароля.</p>"
                + "<hr style='margin:20px 0;'/>"
                + "<p style='font-size:14px;color:#888;'>Если вы не запрашивали это действие, просто проигнорируйте это письмо.</p>"
                + "</div>";

        helper.setSubject(subject);
        helper.setText(text, true); // true — используем HTML
        helper.setTo(userEmail);

        try {
            javaMailSender.send(mimeMessage);
        } catch (MailException e) {
            throw new MailSendException("Не удалось отправить письмо");
        }
    }
}

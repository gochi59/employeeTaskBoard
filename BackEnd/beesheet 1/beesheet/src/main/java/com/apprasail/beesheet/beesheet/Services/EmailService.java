package com.apprasail.beesheet.beesheet.Services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Async
public class EmailService {

    private final JavaMailSender mailSender;
    

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    @Async
    public void sendNewMail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}

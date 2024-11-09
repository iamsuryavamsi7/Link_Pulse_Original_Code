package com.linkpulse.Link_Pulse_API.Link_Pulse_Public.Email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Async
    public void sendSimpleEmail(
            String toEmail,
            String body,
            String subject
    ){

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("iamsuryavamsi@gmail.com");
        message.setTo(toEmail);
        message.setText(body);
        message.setSubject(subject);

        javaMailSender.send(message);

        System.out.println("\n\n\nMail Sent\n\n\n");

    }

    @Async
    public void sendEmailWithAttachment(
            String toEmail,
            String body,
            String subject,
            String attachment
    ) throws MessagingException {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

        mimeMessageHelper.setFrom("iamsuryavamsi@gmail.com");
        mimeMessageHelper.setTo(toEmail);
        mimeMessageHelper.setText(body);
        mimeMessageHelper.setSubject(subject);


        FileSystemResource fileSystemResource = new FileSystemResource(new File(attachment));

        mimeMessageHelper.addAttachment(
                fileSystemResource.getFilename(),
                fileSystemResource
        );

        javaMailSender.send(mimeMessage);

        System.out.println("\n\n\n Mail Sent With Attachement \n\n\n");

    }

}

package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailServiceImpl implements EmailService{

    private final JavaMailSender mailSender;

    //@Value("${spring.mail.username}")
    private String fromEmail = "oubijjane48@gmail.com";

   // @Value("${app.notification.receiver}")
    //private String adminEmail = "z.oubijjane@verauto.ma";

    @Autowired
    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async("emailExecutor")
    @Override
    public void sendOrderNotification(OrderItem order, List<String> receiverEmails) {
        try {
          SimpleMailMessage message = new SimpleMailMessage();

          message.setFrom(fromEmail);
          message.setBcc(receiverEmails.toArray(new String[0]));
          message.setSubject("Nouvelle Commande Créée - ID: " + order.getId());

            String content = String.format(
                "Bonjour,\n\n" +
                        "Une nouvelle commande a été enregistrée :\n" +
                        "- companie : %s\n" +
                        "- Matricule : %s\n" +
                        "- Modèle : %s\n\n" +
                        "Veuillez vous connecter au dashboard pour la traiter.",
                order.getCompany().getCompanyName(),
                order.getRegistrationNumber(),
                order.getCarModel().getModel()
            );

            message.setText(content);

            mailSender.send(message);
        } catch (Exception e) {
            // Since it's async, exceptions won't reach the OrderService
            // You MUST handle/log them here
            System.err.println("❌ Async email error: " + e.getMessage());
        }
    }
}

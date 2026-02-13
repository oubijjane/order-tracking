package com.verAuto.orderTracking.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.*;
import com.verAuto.orderTracking.dao.UserDeviceDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class NotificationServiceImpl implements NotificationService{
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final UserDeviceDAO deviceDAO;

    public NotificationServiceImpl(UserDeviceDAO deviceDAO) {
        this.deviceDAO = deviceDAO;
    }
    
    @Override
    public void send(String token, String title, String body) throws FirebaseMessagingException {
        if (!isFirebaseInitialized()) {
            logger.warn("Firebase not initialized - notification skipped");
            return;
        }
        
        if (token == null || token.isEmpty()) {
            logger.warn("Cannot send notification - token is null or empty");
            return;
        }
        
        try {
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();

            String messageId = FirebaseMessaging.getInstance().send(message);
            logger.info("Notification sent successfully. Message ID: {}", messageId);
        } catch (FirebaseMessagingException e) {
            logger.error("Failed to send notification to token: {}", token, e);
            // If the token is no longer registered on FCM, remove it from our DB
            try {
                MessagingErrorCode mec = e.getMessagingErrorCode();
                if (mec != null && (mec == MessagingErrorCode.UNREGISTERED || mec == MessagingErrorCode.INVALID_ARGUMENT)) {
                    logger.info("Removing unregistered token from DB: {}", token);
                    try {
                        deviceDAO.deleteByToken(token);
                    } catch (Exception ex) {
                        logger.warn("Failed to delete unregistered token {} from DB", token, ex);
                    }
                }
            } catch (Throwable ignored) {
                // ignore any reflection/version issues; proceed to rethrow
            }
            throw e;
        }
    }

    @Override
    public void sendToMany(List<String> tokens, String title, String body) {
        if (tokens == null || tokens.isEmpty()) return;

        // Deduplicate to avoid double notifications
        Set<String> uniqueTokens = new HashSet<>(tokens);
        logger.info("Sending notification to {} unique recipients", uniqueTokens.size());

        int success = 0;
        int failure = 0;

        for (String token : uniqueTokens) {
            try {
                // Send individually - this works (proven by your logs)
                send(token, title, body);
                success++;
            } catch (FirebaseMessagingException e) {
                failure++;
                logger.warn("Failed to send to token: {}", token);

                // Check if the token is dead/unregistered
                MessagingErrorCode errorCode = e.getMessagingErrorCode();
                if (errorCode == MessagingErrorCode.UNREGISTERED ||
                        errorCode == MessagingErrorCode.INVALID_ARGUMENT ||
                        "Requested entity was not found.".equals(e.getMessage())) { // Handle the HTTP v1 404 message

                    logger.info("Removing stale token from DB: {}", token);
                    try {
                        // This will now work because we added @Transactional to the repo
                        deviceDAO.deleteByToken(token);
                    } catch (Exception ex) {
                        logger.error("Failed to remove token from DB", ex);
                    }
                }
            }
        }

        logger.info("Batch complete. Success: {}, Failures: {}", success, failure);
    }
    private boolean isFirebaseInitialized() {
        return !FirebaseApp.getApps().isEmpty();
    }
}

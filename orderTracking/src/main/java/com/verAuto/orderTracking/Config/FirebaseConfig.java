package com.verAuto.orderTracking.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @PostConstruct
    public void init() {
        try {
            logger.info("Attempting to initialize Firebase with credentials from classpath");
            
            // Load from classpath resources
            Resource resource = new ClassPathResource("firebase-service-account.json");
            
            if (!resource.exists()) {
                logger.warn("Firebase service account file not found in classpath. Notifications will be disabled.");
                logger.warn("To enable Firebase notifications, place 'firebase-service-account.json' in src/main/resources/");
                return;
            }

            try (InputStream inputStream = resource.getInputStream()) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(inputStream))
                        .build();

                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                    logger.info("Firebase initialized successfully");
                } else {
                    logger.info("Firebase already initialized");
                }
            }
        } catch (IOException e) {
            logger.error("Failed to initialize Firebase. Notifications will be disabled.", e);
            logger.error("Cause: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during Firebase initialization", e);
        }
    }
}
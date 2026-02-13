package com.verAuto.orderTracking.service;

import com.google.firebase.messaging.FirebaseMessagingException;

import java.util.List;

public interface NotificationService {
    public void send(String token, String title, String body)
            throws FirebaseMessagingException;
    public void sendToMany(List<String> tokens,
                           String title,
                           String body);
}

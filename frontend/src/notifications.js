import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";
import api from "./services/api";

// Helper to check support
const isNotificationsSupported = () => {
  return (
    'serviceWorker' in navigator &&
    'Notification' in window &&
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
  );
};

export const registerServiceWorker = async () => {
  // ... (Your existing code is fine here) ...
  // Ensure the file name matches exactly what is in your public folder
  return navigator.serviceWorker.register('/firebase-messaging-sw.js');
};

let messagingInstance = null;

export const registerForNotifications = async (onForegroundMessage) => {
  // 1. Check Support
  if (!isNotificationsSupported()) {
    console.warn("Notifications not supported.");
    return null;
  }

  try {
    // 2. Register SW
    const registration = await registerServiceWorker();
    
    // 3. Request Permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Permission denied");
      return null;
    }

    // 4. Init Firebase
    if (!messagingInstance) {
      messagingInstance = getMessaging(app);
    }

    // 5. Get Token
    const token = await getToken(messagingInstance, {
      vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration
    });

    if (token) {
      // 6. Idempotent Backend Save
      const LAST_TOKEN_KEY = 'fcm_last_sent_token';
      const savedToken = localStorage.getItem(LAST_TOKEN_KEY);

      if (savedToken !== token) {
        try {
           // Only send if it's actually new
           await api.post('/devices', { token });
           localStorage.setItem(LAST_TOKEN_KEY, token);
           console.log('New token registered:', token);
        } catch (e) {
           console.error('API Sync failed', e);
        }
      }

      // 7. Handle Foreground Messages
      // Using a callback allows your React Component to show a Toast
      onMessage(messagingInstance, (payload) => {
        console.log("Foreground Message:", payload);
        
        // Pass the data back to your UI component to show a Toast
        if (onForegroundMessage) {
          onForegroundMessage(payload);
        }
        
        // ❌ I removed 'new Notification()' here to prevent duplicates
      });
    }

    return token;
  } catch (error) {
    console.error("Notification setup failed:", error);
    return null;
  }
};
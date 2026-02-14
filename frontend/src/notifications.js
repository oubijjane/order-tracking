import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";
import api from "./services/api";

const isNotificationsSupported = () => {
  return 'serviceWorker' in navigator && 'Notification' in window;
};

export const registerForNotifications = async () => {
  if (!isNotificationsSupported()) return null;

  try {
    // 1. Register SW with Env Keys passed in URL
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    const configQuery = encodeURIComponent(JSON.stringify(firebaseConfig));
    const registration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?firebaseConfig=${configQuery}`
    );

    // 2. Request Permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    // 3. Get Token
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration
    });

    if (token) {
      // 4. Save to Backend (Idempotent)
      const savedToken = localStorage.getItem('fcm_last_sent_token');
      if (savedToken !== token) {
        await api.post('/devices', { token });
        localStorage.setItem('fcm_last_sent_token', token);
      }

      // 5. Handle Foreground Clicks
      onMessage(messaging, (payload) => {
        const { title, body } = payload.notification;
        const clickAction = payload.data?.click_action || '/';

        const notification = new Notification(title, {
          body: body,
          icon: '/verauto-logo.png',
          tag: 'foreground-notification' // Prevents stack of notifications
        });

        notification.onclick = (event) => {
          event.preventDefault();
          window.location.href = clickAction; // Redirect to the order path
          notification.close();
        };
      });
    }
    return token;
  } catch (err) {
    console.error("FCM Setup Error:", err);
    return null;
  }
};
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";
import api from "./services/api";

export const registerForNotifications = async () => {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration
    });

    if (token) {
      // Send to backend only if changed
      if (localStorage.getItem('fcm_token') !== token) {
        await api.post('/devices', { token });
        localStorage.setItem('fcm_token', token);
      }

      // 🚀 FOREGROUND HANDLER
      onMessage(messaging, async (payload) => {
        const title = payload.data?.title || "Verauto Update";
        const body = payload.data?.body || "New update on your order.";
        const url = payload.data?.click_action || "/";

        // 1. Wait for the service worker to be completely ready
        const swRegistration = await navigator.serviceWorker.ready;
        
        // 2. Ask the service worker to show the OS-level notification
        swRegistration.showNotification(title, {
          body: body,
          icon: "/verauto-logo.png",
          data: {
            click_action: url
          }
        });
      });
    }
  } catch (err) {
    console.error("Notification Setup Error", err);
  }
};

// 🚀 LISTEN FOR REDIRECT MESSAGES FROM THE SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.action === 'REDIRECT') {
      // Navigate the browser to the exact URL sent by the notification
      window.location.href = event.data.url;
    }
  });
}
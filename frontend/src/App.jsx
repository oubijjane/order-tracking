import { Outlet, useNavigate } from "react-router";
import Navbar from "./components/NavBar";
import './styles/App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from "react";
import { registerForNotifications } from "./notifications"; // This is your existing Web Push
import { DownloadProvider } from './context/DownloadContext';

// --- NEW CAPACITOR IMPORTS ---
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. WEB PWA NOTIFICATIONS (Your existing logic)
  useEffect(() => {
    if (user && !Capacitor.isNativePlatform()) {
      registerForNotifications().catch(err => console.warn("Web Push failed:", err));
    }
  }, [user]);

  // 2. NATIVE CAPACITOR NOTIFICATIONS (The new fix)
  useEffect(() => {
    if (user && Capacitor.isNativePlatform()) {
      setupNativeNotifications(user.id);
    }
  }, [user]);

  const setupNativeNotifications = async (userId) => {
    // Request permission from Android
    let perm = await PushNotifications.requestPermissions();
    if (perm.receive === 'granted') {
      await PushNotifications.register();
    }

    // Get the Native Token and send it to Spring Boot
    PushNotifications.addListener('registration', (token) => {
      console.log("Native Token:", token.value);
      // CALL YOUR BACKEND HERE:
      // api.post('/devices/register', { userId, token: token.value, deviceType: 'ANDROID' })
    });

    // Handle what happens when the user clicks the notification
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const targetUrl = action.notification.data.click_action || '/';
      const path = new URL(targetUrl, window.location.origin).pathname;
      navigate(path); 
    });
  };

  // 3. SERVICE WORKER MESSAGES (For PWA Redirects)
  useEffect(() => {
    const handleSWMessage = (event) => {
      if (event.data?.action === 'REDIRECT') {
        const targetPath = new URL(event.data.url).pathname;
        navigate(targetPath);
      }
    };

    if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleSWMessage);
    }
  }, [navigate]);

  return (
    <DownloadProvider>
      <div>
        <Navbar />
        <Outlet />
      </div>
    </DownloadProvider>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
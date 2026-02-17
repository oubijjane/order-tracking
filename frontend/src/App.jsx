import { Outlet, useNavigate} from "react-router";
import Navbar from "./components/NavBar";
import './styles/App.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { registerForNotifications } from "./notifications";
import { DownloadProvider } from './context/DownloadContext';

function AppContent() {
  const { user } = useAuth()
  const navigate = useNavigate();
   useEffect(() => {
    // Register FCM token on app load
    if (user) {
      registerForNotifications().catch(err => {
        console.warn("Failed to register notifications:", err);
        // Don't crash the app if notifications fail
      });
    }
  }, [user]);
  
  useEffect(() => {
    const handleSWMessage = (event) => {
      if (event.data?.action === 'REDIRECT') {
        try {
          // Extract just the path (e.g., "/orders/123") from the full URL string
          const targetPath = new URL(event.data.url).pathname;
          
          // Force React Router to handle the transition smoothly
          navigate(targetPath);
        } catch (error) {
          console.error("Failed to parse redirect URL from notification:", error);
        }
      }
    };

    // Attach the listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }

    // Clean up the listener when the component unmounts
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
    };
  }, [navigate]);
  return (
    <DownloadProvider>
      <div>
      {/* Navigation Bar */}
      <Navbar />
      {/* The Content Area */}
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
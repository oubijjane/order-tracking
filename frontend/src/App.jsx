import { Outlet} from "react-router";
import Navbar from "./components/NavBar";
import './styles/App.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { registerForNotifications } from "./notifications";
import { DownloadProvider } from './context/DownloadContext';

function AppContent() {
  const { user } = useAuth()
   useEffect(() => {
    // Register FCM token on app load
    if (user) {
      registerForNotifications().catch(err => {
        console.warn("Failed to register notifications:", err);
        // Don't crash the app if notifications fail
      });
    }
  }, [user]);
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
import { Outlet} from "react-router";
import Navbar from "./components/NavBar";
import './styles/App.css';
import { AuthProvider } from './context/AuthContext';
import { DownloadProvider } from './context/DownloadContext';
export function App() {
  return (
    <AuthProvider>
      <DownloadProvider>
      <div>
        {/* Navigation Bar */}
        <Navbar />
      {/* The Content Area */}
      <Outlet />
    </div>
    </DownloadProvider>
    </AuthProvider>
  );
}

export default App
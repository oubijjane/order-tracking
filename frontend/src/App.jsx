import { Outlet} from "react-router";
import Navbar from "./components/NavBar";
import './styles/App.css';
import { AuthProvider } from './context/AuthContext';
export function App() {
  return (
    <AuthProvider>
      <div>
        {/* Navigation Bar */}
        <Navbar />
      {/* The Content Area */}
      <Outlet />
    </div>
    </AuthProvider>
  );
}

export default App
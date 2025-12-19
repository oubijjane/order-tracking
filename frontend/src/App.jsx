import { Outlet} from "react-router";
import Navbar from "./components/NavBar";
import './styles/App.css';
export function App() {
  return (
    <div>
      {/* Navigation Bar */}
      <Navbar />
      {/* The Content Area */}
      <Outlet />
    </div>
  );
}

export default App
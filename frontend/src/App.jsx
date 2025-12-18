import { Link, Outlet, NavLink } from "react-router";
import Navbar from "./components/NavBar";
export function App() {
  return (
    <div>
      {/* Navigation Bar */}
      <Navbar />
      {/* The Content Area */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default App
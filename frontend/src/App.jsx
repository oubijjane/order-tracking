import { Link, Outlet, NavLink } from "react-router";
export function App() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav style={{ padding: '15px', background: '#f0f0f0', marginBottom: '20px' }}>
        {/* If Link doesn't work, use: <a href="/">Home</a> */}
        <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
        <Link to="/create">Create Order</Link>
      </nav>

      {/* The Content Area */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default App
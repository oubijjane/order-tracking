import { Link } from "react-router";

function Navbar() {
  return (
      <nav style={{ padding: '15px', background: '#f0f0f0', marginBottom: '20px' }}>
        {/* If Link doesn't work, use: <a href="/">Home</a> */}
        <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
        <Link to="/create" style={{ marginRight: '15px' }}>Create Order</Link>
        <Link to="/orders" style={{ marginRight: '15px' }}>Orders</Link>
      </nav>
  );
}

export default Navbar;
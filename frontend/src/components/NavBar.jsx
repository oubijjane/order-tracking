import { NavLink } from 'react-router';
import { useState } from 'react';
import '../styles/NavBar.css';
import logo from '../assets/verauto-logo.png';


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="main-navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo" onClick={closeMenu}>
          <img src={logo} alt="VerAuto Logo" className="brand-img" />
        </NavLink>

        {/* This icon is hidden on Desktop via CSS */}
        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" className="nav-item" onClick={closeMenu} end>
            Dashboard
          </NavLink>
          <NavLink to="/create" className="nav-item" onClick={closeMenu}>
            nouvelle Commande
          </NavLink>
          <NavLink to="/orders" className="nav-item" onClick={closeMenu}>
            Tous les Commandes
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
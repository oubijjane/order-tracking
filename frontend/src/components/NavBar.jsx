import { NavLink, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/NavBar.css';
import logo from '../assets/verauto-logo.png';


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // Close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);
  const { user, loading: authLoading } = useAuth();
  const roles = user?.roles || [];

  const logout = () => {
    // 1. Remove the token from storage
    localStorage.removeItem('token');
    navigate('/login');

  };

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
            Commandes
          </NavLink>
          <NavLink to="/search" className="nav-item" onClick={closeMenu}>
            Recherche
          </NavLink>
          {(roles.includes('ROLE_ADMIN') || roles.includes('ROLE_GESTIONNAIRE')) && (
            <NavLink to="/admin" className="nav-item" onClick={closeMenu}>
              Admin
            </NavLink>
          )}
          <NavLink to="/login" className="nav-item" onClick={logout}>
            logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
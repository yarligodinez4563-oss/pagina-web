import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          📚 <span>BiblioTech</span>
        </Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Catálogo
          </Link>
          <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
            Favoritos
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className={`nav-link nav-link-admin ${isActive('/admin') ? 'active' : ''}`}>
              Administración
            </Link>
          )}
          <div className="nav-user">
            <span className="nav-user-name">{user?.name}</span>
            <button className="btn-logout" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

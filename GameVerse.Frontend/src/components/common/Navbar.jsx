// ../components/common/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎮 GameVerse
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/feed" className={location.pathname === '/feed' ? 'nav-link active' : 'nav-link'}>
                📰 Feed
              </Link>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}>
                🎮 Dashboard
              </Link>
              <Link to={`/profile/${user.username}`} className={location.pathname.includes('/profile') ? 'nav-link active' : 'nav-link'}>
                👤 Perfil
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={location.pathname === '/login' ? 'nav-link active' : 'nav-link'}
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className={location.pathname === '/register' ? 'nav-link active' : 'nav-link'}
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
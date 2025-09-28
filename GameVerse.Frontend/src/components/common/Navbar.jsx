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
              <Link 
                to="/dashboard" 
                className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Sair
              </button>
              <span className="nav-user">Olá, {user.username}!</span>
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
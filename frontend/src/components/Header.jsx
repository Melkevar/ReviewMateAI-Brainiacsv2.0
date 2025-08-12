import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        <FileText size={32} />
        Review Mate AI
      </Link>
      
      {user && (
        <nav className="header-nav">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/upload" 
            className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
          >
            Upload Contract
          </Link>
          
          <div className="user-info">
            <User size={20} />
            <span>{user.name}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
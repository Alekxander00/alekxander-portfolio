import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlitchText from './GlitchText';
import '../styles/components.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/about', label: 'Sobre mí' },
    { path: '/projects', label: 'Proyectos' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <GlitchText text="ALEKXANDER" tag="h1" />
        </Link>
        
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-link-text">{item.label}</span>
                  <span className="nav-link-glitch"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import MyAvatar from '../assets/MyAvatar.jpeg';
import iconMoon from '../assets/icon-moon.svg';
import iconSun from '../assets/icon-sun.svg';
import iconMenu from '../assets/icon-menu.png'; 
import iconClose from '../assets/icon-close.svg'; 

const Header = () => {
  const location = useLocation(); 
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : '';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Close menu on route change
  useEffect(() => setIsMenuOpen(false), [location]);

  // Helper to check active state
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <div className="container header__content">
        
        {/* 1. BRAND AREA (Avatar + Name) */}
        <Link to="/" className="header__brand">
          <img src={MyAvatar} alt="Profile" className="header__avatar" />
          <span className="header__title">Robin.</span>
        </Link>

        {/* 2. DESKTOP NAVIGATION */}
        <nav className="header__nav-desktop">
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            <Link to="/blog" className={`nav-link ${isActive('/blog')}`}>Blog</Link>
            <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
            <Link to="/newsletter" className={`nav-link ${isActive('/newsletter')}`}>Newsletter</Link>
        </nav>

        {/* 3. CONTROLS (Theme + Mobile Menu) */}
        <div className="header__controls">
            <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle Theme">
                <img src={isDarkMode ? iconSun : iconMoon} alt="Theme" />
            </button>

            <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                <img src={isMenuOpen ? iconClose : iconMenu} alt="Menu" />
            </button>
        </div>

        {/* 4. MOBILE MENU OVERLAY */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="mobile-link">Home</Link>
            <Link to="/blog" className="mobile-link">Blog</Link>
            <Link to="/about" className="mobile-link">About</Link>
            <Link to="/newsletter" className="mobile-link">Newsletter</Link>
        </div>

      </div>
    </header>
  );
};

export default Header;